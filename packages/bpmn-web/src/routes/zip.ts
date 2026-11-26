import zlib from 'node:zlib';

/** A .zip of files (name -> contents), deflated: the models folder downloaded at once. */
export function zip(files: { name: string; data: Buffer }[]): Buffer {
    const locals: Buffer[] = [], centrals: Buffer[] = [];
    let offset = 0;
    for (const { name, data } of files) {
        const fileName = Buffer.from(name, 'utf8');
        const packed = zlib.deflateRawSync(data);
        const crc = crc32(data);
        const local = Buffer.alloc(30);
        local.writeUInt32LE(0x04034b50, 0);     // local file header
        local.writeUInt16LE(20, 4);             // version needed
        local.writeUInt16LE(0x0800, 6);         // UTF-8 names
        local.writeUInt16LE(8, 8);              // deflate
        local.writeUInt32LE(crc, 14);
        local.writeUInt32LE(packed.length, 18);
        local.writeUInt32LE(data.length, 22);
        local.writeUInt16LE(fileName.length, 26);
        const central = Buffer.alloc(46);
        central.writeUInt32LE(0x02014b50, 0);   // central directory header
        central.writeUInt16LE(20, 4);
        central.writeUInt16LE(20, 6);
        central.writeUInt16LE(0x0800, 8);
        central.writeUInt16LE(8, 10);
        central.writeUInt32LE(crc, 16);
        central.writeUInt32LE(packed.length, 20);
        central.writeUInt32LE(data.length, 24);
        central.writeUInt16LE(fileName.length, 28);
        central.writeUInt32LE(offset, 42);
        locals.push(local, fileName, packed);
        centrals.push(central, fileName);
        offset += local.length + fileName.length + packed.length;
    }
    const directory = Buffer.concat(centrals);
    const end = Buffer.alloc(22);
    end.writeUInt32LE(0x06054b50, 0);           // end of central directory
    end.writeUInt16LE(files.length, 8);
    end.writeUInt16LE(files.length, 10);
    end.writeUInt32LE(directory.length, 12);
    end.writeUInt32LE(offset, 16);
    return Buffer.concat([...locals, directory, end]);
}

const TABLE = Array.from({ length: 256 }, (_, n) => {
    let c = n;
    for (let k = 0; k < 8; k++)
        c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    return c >>> 0;
});

function crc32(data: Buffer): number {
    let crc = 0xffffffff;
    for (const byte of data)
        crc = TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
    return (crc ^ 0xffffffff) >>> 0;
}

/** Why a .zip was refused: a message for the person who sent it. */
export class ZipError extends Error { }

export interface UnzipLimits {
    /** most entries */
    files: number;
    /** most bytes one entry may have once unpacked */
    entryBytes: number;
    /** most bytes all of them may have */
    totalBytes: number;
}
const DEFAULT_LIMITS: UnzipLimits = { files: 500, entryBytes: 10 * 1024 * 1024, totalBytes: 50 * 1024 * 1024 };

/** Whether an entry's name stays inside the folder it is unpacked into: relative, forward slashes, no `..`, no drive. */
export function isSafeEntryName(name: string): boolean {
    if (!name || name.length > 300 || /[\\\x00-\x1f]/.test(name) || name.startsWith('/') || /^[A-Za-z]:/.test(name)) return false;
    return name.split('/').every((part, i, all) => (part !== '' || i === all.length - 1) && part !== '.' && part !== '..');
}

/**
 * The files of a .zip (name -> contents): stored or deflated entries only, unpacked in memory within limits (how many,
 * how large each, how large in all), each checked against its CRC. A name that leaves the folder, an encrypted or
 * Zip64 archive, an unknown compression, a name twice, or an entry that unpacks larger than it says is refused
 * (ZipError). Folders are left out.
 */
export function unzip(archive: Buffer, limits: Partial<UnzipLimits> = {}): { name: string; data: Buffer }[] {
    const max = { ...DEFAULT_LIMITS, ...limits };
    // the end of the central directory: the last 22 bytes, or before a comment of up to 64 KB
    let end = -1;
    for (let at = archive.length - 22; at >= Math.max(0, archive.length - 22 - 0xffff); at--)
        if (archive.readUInt32LE(at) === 0x06054b50) { end = at; break; }
    if (end < 0) throw new ZipError('It is not a .zip file.');
    const count = archive.readUInt16LE(end + 10);
    const size = archive.readUInt32LE(end + 12);
    let at = archive.readUInt32LE(end + 16);
    if (count === 0xffff || size === 0xffffffff || at === 0xffffffff) throw new ZipError('A Zip64 archive is not supported.');
    if (count > max.files) throw new ZipError(`The .zip holds ${count} files: at most ${max.files}.`);
    if (at + size > end) throw new ZipError('The .zip is damaged: its directory is out of place.');
    const files: { name: string; data: Buffer }[] = [], seen = new Set<string>();
    let total = 0;
    for (let n = 0; n < count; n++) {
        if (at + 46 > archive.length || archive.readUInt32LE(at) !== 0x02014b50) throw new ZipError('The .zip is damaged: a directory entry is missing.');
        const flags = archive.readUInt16LE(at + 8), method = archive.readUInt16LE(at + 10);
        const crc = archive.readUInt32LE(at + 16), packedSize = archive.readUInt32LE(at + 20), fileSize = archive.readUInt32LE(at + 24);
        const nameLength = archive.readUInt16LE(at + 28), extraLength = archive.readUInt16LE(at + 30), commentLength = archive.readUInt16LE(at + 32);
        const local = archive.readUInt32LE(at + 42);
        const name = archive.toString('utf8', at + 46, at + 46 + nameLength);
        at += 46 + nameLength + extraLength + commentLength;
        if (!isSafeEntryName(name)) throw new ZipError(`The .zip holds a file name that is not allowed: '${name}'.`);
        if (name.endsWith('/')) continue;
        if (flags & 1) throw new ZipError(`'${name}' is encrypted.`);
        if (method !== 0 && method !== 8) throw new ZipError(`'${name}' is compressed in a way that is not supported.`);
        if (packedSize === 0xffffffff || fileSize === 0xffffffff) throw new ZipError('A Zip64 archive is not supported.');
        if (fileSize > max.entryBytes) throw new ZipError(`'${name}' is larger than ${Math.round(max.entryBytes / 1048576)} MB.`);
        if (seen.has(name)) throw new ZipError(`'${name}' is in the .zip twice.`);
        seen.add(name);
        if (local + 30 > archive.length || archive.readUInt32LE(local) !== 0x04034b50) throw new ZipError(`The .zip is damaged: '${name}' has no data.`);
        const start = local + 30 + archive.readUInt16LE(local + 26) + archive.readUInt16LE(local + 28);
        if (start + packedSize > archive.length) throw new ZipError(`The .zip is damaged: '${name}' is cut short.`);
        const packed = archive.subarray(start, start + packedSize);
        let data: Buffer;
        try { data = method === 0 ? Buffer.from(packed) : zlib.inflateRawSync(packed, { maxOutputLength: max.entryBytes }); }
        catch { throw new ZipError(`'${name}' can not be unpacked.`); }
        if (data.length !== fileSize) throw new ZipError(`'${name}' is not the size the .zip says.`);
        if (crc32(data) !== crc) throw new ZipError(`'${name}' does not match its checksum: the .zip is damaged.`);
        total += data.length;
        if (total > max.totalBytes) throw new ZipError(`The .zip unpacks to more than ${Math.round(max.totalBytes / 1048576)} MB.`);
        files.push({ name, data });
    }
    return files;
}
