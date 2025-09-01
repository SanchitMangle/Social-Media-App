import { ArrowLeft, Sparkle, TextIcon, Upload } from 'lucide-react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

const StoryModel = ({ setShowModel, fetchStories }) => {
    const bgColors = ['#4f46e5', '#7c3aed', '#db2777', '#e11d48', '#ca8a04', '#0d9488']
    const [mode, setMode] = useState('text')
    const [text, setText] = useState('')
    const [media, setMedia] = useState(null)
    const [previewUrl, setPreviewUrl] = useState(null)
    const [background, setBackground] = useState(bgColors[0])

    const handleMedia = async (e) => {
        const file = e.target.files?.[0]
        if (file) {
            setMedia(file)
            setPreviewUrl(URL.createObjectURL(file))
        }
    }

    const handleCreateStory = async () => {
        // Save story (text or media)
        // Later integrate with backend
        console.log({ mode, text, media, background })
        setShowModel(false)
        fetchStories()
    }

    return (
        <div className="fixed inset-0 z-[110] min-h-screen bg-black/80 backdrop-blur text-white flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="flex items-center justify-between mb-4 text-center">
                    <button onClick={() => setShowModel(false)} className="text-white p-2 cursor-pointer">
                        <ArrowLeft />
                    </button>
                    <h2 className="text-lg font-semibold">Create Story</h2>
                    <span className="w-10"></span>
                </div>

                {/* Preview */}
                <div
                    className="rounded-lg h-96 flex items-center justify-center relative overflow-hidden"
                    style={{ backgroundColor: background }}
                >
                    {mode === 'text' && (
                        <textarea
                            onChange={(e) => setText(e.target.value)}
                            value={text}
                            className="bg-transparent text-white w-full h-full text-lg p-6 resize-none focus:outline-none text-center"
                            placeholder="What's on your mind?"
                        />
                    )}

                    {mode === 'media' && previewUrl && (
                        media?.type.startsWith('image')
                            ? <img src={previewUrl} className="object-contain max-h-full" alt="" />
                            : <video src={previewUrl} className="object-contain max-h-full" controls />
                    )}
                </div>

                {/* Background colors */}
                {mode === 'text' && (
                    <div className="flex mt-4 gap-2">
                        {bgColors.map((color) => (
                            <button
                                onClick={() => setBackground(color)}
                                key={color}
                                className="w-6 h-6 rounded-full ring cursor-pointer"
                                style={{ backgroundColor: color }}
                            />
                        ))}
                    </div>
                )}

                {/* Mode buttons */}
                <div className="flex gap-2 mt-4">
                    <button
                        onClick={() => { setMode('text'); setMedia(null); setPreviewUrl(null) }}
                        className={`flex-1 flex items-center justify-center gap-2 p-2 rounded cursor-pointer ${mode === 'text' ? 'bg-white text-black' : 'bg-zinc-800'}`}
                    >
                        <TextIcon size={18} />Text
                    </button>

                    <label
                        className={`flex-1 flex items-center justify-center gap-2 p-2 rounded cursor-pointer ${mode === 'media' ? 'bg-white text-black' : 'bg-zinc-800'}`}
                    >
                        <input
                            onChange={(e) => { handleMedia(e); setMode('media') }}
                            type="file"
                            accept="image/*,video/*"
                            className="hidden"
                        />
                        <Upload size={18} /> Photo/Video
                    </label>
                </div>

                {/* Submit */}
                <button
                    onClick={() => toast.promise(handleCreateStory(),{loading:"Saving...",success:<p>Story Added</p>,
                    error : e  => <P>{e.message}</P>
                    })}
                    className="flex items-center justify-center gap-2 text-white mt-4 py-3 w-full rounded bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 active:scale-95 transition cursor-pointer"
                >
                    <Sparkle size={18}/>
                    Create Story
                </button>
            </div>
        </div>
    )
}

export default StoryModel
