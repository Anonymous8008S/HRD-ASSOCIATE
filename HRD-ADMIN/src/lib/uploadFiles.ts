import { storage } from "@/lib/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export type ProgressCallback = (progressPercent: number) => void;

export const uploadFilesWithProgress = async (
  files: File[],
  folder: string,
  onProgress?: ProgressCallback
): Promise<string[]> => {
  const urls: string[] = [];
  for (const file of files) {
    const uniqueId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const storageRef = ref(storage, `public/${folder}/${uniqueId}-${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    await new Promise<void>((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) onProgress(Math.round(progress));
        },
        (err) => reject(err),
        async () => {
          try {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            urls.push(url);
            resolve();
          } catch (err) {
            reject(err);
          }
        }
      );
    });
  }
  return urls;
};

export const uploadFiles = (files: File[], folder: string) =>
  uploadFilesWithProgress(files, folder);
