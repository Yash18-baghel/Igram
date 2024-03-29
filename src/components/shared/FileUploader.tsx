import { useState, useCallback, Fragment } from 'react'
import { FileWithPath, useDropzone } from 'react-dropzone'
import { Button } from '../ui/button'
type FileUploaderProps = {
    fileChange: (file: File[]) => void,
    mediaUrl?: string | undefined;
}
const FileUploader = ({ fileChange, mediaUrl }: FileUploaderProps) => {
    const [fileUrl, setFileUrl] = useState(mediaUrl)
    const [file, setFile] = useState<File[]>([])
    const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
        setFile(acceptedFiles);
        fileChange(acceptedFiles);
        setFileUrl(URL.createObjectURL(acceptedFiles[0]))
    }, [file])
    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            "image/*": ['.jpg', '.jpeg', '.png', '.svg'],
        }
    })

    return (
        <div
            className='flex flex-center flex-col bg-dark-3 rounded-xl cursor-pointer'
            {...getRootProps()}
        >
            <input {...getInputProps()} className='cursor-pointer' />
            {
                fileUrl ?
                    <Fragment>
                        <div className='flex flex-1 justify-center w-full p-5 lg:p-10'>
                            <img
                                src={fileUrl}
                                alt="uploaded-image"
                                className='file_uploader-img' />
                        </div>
                        <p className="file_uploader-label">click or drag photo to replace</p>
                    </Fragment>
                    :
                    <div className="file_uploader-box">
                        <img
                            src="assets/icons/file-upload.svg"
                            alt="file-upload"
                            width={96}
                            height={77}
                        />

                        <h3 className="base-medium text-light-2 mb-2 mt-6">
                            Drag Photo here
                        </h3>
                        <p className="text-light-4 small-regular mb-6">
                            SVG, PNG, JPG
                        </p>
                        <Button className='shad-button_dark_4'>
                            Select From Media
                        </Button>
                    </div>
            }
        </div>
    )
}

export default FileUploader