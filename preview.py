#!/usr/bin/env python3
"""Serve this static site locally, including byte ranges for video seeking."""

import argparse
import re
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


class PreviewHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Accept-Ranges", "bytes")
        super().end_headers()

    def send_head(self):
        self.remaining_bytes = None
        requested = self.headers.get("Range", "")
        match = re.fullmatch(r"bytes=(\d*)-(\d*)", requested.strip())
        path = Path(self.translate_path(self.path))
        if not match or not any(match.groups()) or not path.is_file():
            return super().send_head()

        try:
            source = path.open("rb")
        except OSError:
            self.send_error(404, "File not found")
            return None
        try:
            import os
            stat = os.fstat(source.fileno())
            modified = self.date_time_string(stat.st_mtime)
            # A stale/unknown validator falls back to the complete resource.
            if self.headers.get("If-Range", modified) != modified:
                source.close()
                return super().send_head()
            size = stat.st_size
            first, last = match.groups()
            if first:
                start = int(first)
                end = min(int(last), size - 1) if last else size - 1
            else:
                start = max(0, size - int(last))
                end = size - 1
            if start >= size or end < start:
                source.close()
                self.send_response(416)
                self.send_header("Content-Range", f"bytes */{size}")
                self.send_header("Content-Length", "0")
                self.end_headers()
                return None

            self.remaining_bytes = end - start + 1
            self.send_response(206)
            self.send_header("Content-Type", self.guess_type(str(path)))
            self.send_header("Content-Range", f"bytes {start}-{end}/{size}")
            self.send_header("Content-Length", str(self.remaining_bytes))
            self.send_header("Last-Modified", modified)
            self.end_headers()
            source.seek(start)
            return source
        except Exception:
            source.close()
            raise

    def copyfile(self, source, outputfile):
        try:
            if self.remaining_bytes is None:
                return super().copyfile(source, outputfile)
            while self.remaining_bytes:
                data = source.read(min(65536, self.remaining_bytes))
                if not data:
                    break
                outputfile.write(data)
                self.remaining_bytes -= len(data)
        except (BrokenPipeError, ConnectionResetError):
            # Browsers cancel pending transfers when switching/pausing clips.
            pass


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--port", type=int, default=8000)
    args = parser.parse_args()
    root = Path(__file__).resolve().parent
    server = ThreadingHTTPServer(
        ("127.0.0.1", args.port), partial(PreviewHandler, directory=str(root))
    )
    print(f"CW-WAM preview: http://127.0.0.1:{args.port}/", flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
