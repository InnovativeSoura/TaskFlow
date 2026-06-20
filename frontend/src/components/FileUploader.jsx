import {
  useState,
} from "react";
import axios from "axios";

function FileUploader({
  taskId,
  userId,
}) {
  const [file, setFile] =
    useState(null);

  const uploadFile =
    async () => {
      const formData =
        new FormData();

      formData.append(
        "file",
        file
      );

      formData.append(
        "taskId",
        taskId
      );

      formData.append(
        "userId",
        userId
      );

      await axios.post(
        "http://localhost:5000/api/files/upload",
        formData
      );

      alert(
        "File Uploaded"
      );
    };

  return (
    <div>
      <input
        type="file"
        onChange={(e) =>
          setFile(
            e.target.files[0]
          )
        }
      />

      <button
        onClick={
          uploadFile
        }
      >
        Upload
      </button>
    </div>
  );
}

export default FileUploader;