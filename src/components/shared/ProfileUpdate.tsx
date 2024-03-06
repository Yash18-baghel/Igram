import { Loader } from 'lucide-react';
import { useState, useCallback, Fragment, useEffect } from 'react'
import { FileWithPath, useDropzone } from 'react-dropzone'
// import { Button } from '../ui/button'
type ProfileUpdateProps = {
    fileChange: (file: File[]) => void,
    mediaUrl?: string | undefined;
}
const ProfileUpdate = ({ fileChange, mediaUrl }: ProfileUpdateProps) => {
    const [fileUrl, setFileUrl] = useState(mediaUrl)

    useEffect(() => setFileUrl(mediaUrl), [mediaUrl]);

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
            className='flex'
            {...getRootProps()}
        >
            <input {...getInputProps()} className='cursor-pointer' />
            {
                fileUrl ?
                    <Fragment>
                        <div className='flex gap-3 cursor-pointer'>
                            <img
                                src={fileUrl}
                                alt="uploaded-image"
                                width={90}
                                height={90}
                                className='rounded-full'

                            />
                            <div className="flex justify-center items-center">
                                <h2 className="body-bold text-piramary-400">Chnange Profile Photo</h2>
                            </div>
                        </div>
                    </Fragment>
                    :
                    <div className="flex justify-center">
                        <Loader />
                    </div>
            }
        </div>
    )
}

export default ProfileUpdate