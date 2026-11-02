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
