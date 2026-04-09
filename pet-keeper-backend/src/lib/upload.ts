import { Request } from 'express';
import multer from 'multer';
import sharp from 'sharp';
import { fileTypeFromBuffer } from 'file-type';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

// 允许的文件类型
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif'
];

// 允许的文件扩展名
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

// 最大文件大小 (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// 图片处理配置
const IMAGE_CONFIG = {
  maxWidth: 2048,
  maxHeight: 2048,
  quality: 85,
  format: 'jpeg' as const
};

// 存储配置
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = './uploads';

    // 确保上传目录存在
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // 生成安全的文件名
    const uniqueSuffix = crypto.randomUUID();
    const ext = path.extname(file.originalname).toLowerCase();
    const filename = `${uniqueSuffix}${ext}`;

    cb(null, filename);
  }
});

// 文件过滤器
const fileFilter = async (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  try {
    // 检查文件扩展名
    const ext = path.extname(file.originalname).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return cb(new Error(`不支持的文件类型: ${ext}`));
    }

    // 检查MIME类型
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return cb(new Error(`不支持的MIME类型: ${file.mimetype}`));
    }

    // 验证真实文件类型
    const buffer = await streamToBuffer(file.stream);
    const fileType = await fileTypeFromBuffer(buffer);

    if (!fileType || !ALLOWED_MIME_TYPES.includes(fileType.mime)) {
      return cb(new Error('文件类型验证失败'));
    }

    // 检查文件大小
    if (buffer.length > MAX_FILE_SIZE) {
      return cb(new Error(`文件大小超过限制 (${MAX_FILE_SIZE / 1024 / 1024}MB)`));
    }

    // 病毒扫描（可选，需要安装clamav）
    // const isSafe = await scanVirus(buffer);
    // if (!isSafe) {
    //   return cb(new Error('文件不安全'));
    // }

    // 恢复文件流
    file.stream = bufferToStream(buffer);

    cb(null, true);
  } catch (error) {
    cb(error as Error);
  }
};

// Multer实例
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 5 // 最多5个文件
  }
});

// 图片处理函数
export const processImage = async (inputPath: string, outputPath?: string) => {
  try {
    const image = sharp(inputPath);

    // 获取图片信息
    const metadata = await image.metadata();

    // 处理图片
    let processedImage = image;

    // 调整大小（如果超过最大尺寸）
    if (
      (metadata.width && metadata.width > IMAGE_CONFIG.maxWidth) ||
      (metadata.height && metadata.height > IMAGE_CONFIG.maxHeight)
    ) {
      processedImage = processedImage.resize(IMAGE_CONFIG.maxWidth, IMAGE_CONFIG.maxHeight, {
        fit: 'inside',
        withoutEnlargement: true
      });
    }

    // 转换格式和质量
    processedImage = processedImage.jpeg({
      quality: IMAGE_CONFIG.quality,
      progressive: true
    });

    // 保存处理后的图片
    const output = outputPath || inputPath;
    await processedImage.toFile(output);

    // 删除原图（如果生成了新文件）
    if (outputPath && outputPath !== inputPath) {
      await fs.promises.unlink(inputPath);
    }

    return {
      success: true,
      path: output,
      size: (await fs.promises.stat(output)).size
    };
  } catch (error) {
    console.error('图片处理失败:', error);
    return {
      success: false,
      error: '图片处理失败'
    };
  }
};

// 验证图片内容
export const validateImageContent = async (buffer: Buffer): Promise<boolean> => {
  try {
    const metadata = await sharp(buffer).metadata();

    // 检查是否有有效的图片尺寸
    if (!metadata.width || !metadata.height) {
      return false;
    }

    // 检查图片是否过大
    if (metadata.width > 10000 || metadata.height > 10000) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
};

// 辅助函数：Stream转Buffer
async function streamToBuffer(stream: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on('data', (chunk: Buffer) => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
}

// 辅助函数：Buffer转Stream
function bufferToStream(buffer: Buffer): any {
  const { Readable } = require('stream');
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
}

// 删除文件
export const deleteFile = async (filePath: string): Promise<boolean> => {
  try {
    await fs.promises.unlink(filePath);
    return true;
  } catch (error) {
    console.error('删除文件失败:', error);
    return false;
  }
};

// 清理临时文件
export const cleanupTempFiles = async (directory: string, maxAge: number = 3600000) => {
  try {
    const files = await fs.promises.readdir(directory);
    const now = Date.now();

    for (const file of files) {
      const filePath = path.join(directory, file);
      const stat = await fs.promises.stat(filePath);

      if (now - stat.mtimeMs > maxAge) {
        await fs.promises.unlink(filePath);
        console.log('🗑️  清理临时文件:', file);
      }
    }
  } catch (error) {
    console.error('清理临时文件失败:', error);
  }
};

export default upload;