"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import FileComponent from "../../../../components/file";

type FileItem = {
  id: number;
  fileName: string;
  url: string;
  uploader: { name: string };
};

export default function Page() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null) as React.RefObject<HTMLInputElement>;      // this is typescript reference the input
  const { id } = useParams<{ id: string }>();
  
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.replace("/auth/login");
    } else {
      setReady(true);
      fetchFiles();
    }
  }, [router]);

  const fetchFiles = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${id}/files`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,      // Bearer is only check the access the token is have or not
        },
      });
      if (!res.ok) throw new Error("Failed to load files");       //stop execution and raise an error 
      const json = await res.json();
      setFiles(json);
    } catch (err) {
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    setUploading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${id}/files/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      await fetchFiles(); // refresh list
      setSelectedFile(null);
    } catch (err) {
    } finally {
      setUploading(false);
    }
  };

  if (!ready) {
    return (
      <div className="p-8 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <FileComponent 
      files={files}
      selectedFile={selectedFile}
      uploading={uploading}
      fileInputRef={fileInputRef}
      handleUploadClick={handleUploadClick}
      handleFileChange={handleFileChange}
      handleUpload={handleUpload}
    />
  );
}