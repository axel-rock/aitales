import {
	getStorage,
	ref,
	uploadBytes as _uploadBytes,
	uploadString as _uploadString,
	getDownloadURL as _getDownloadURL
} from 'firebase/storage'
import { app } from '$lib/firebase'

const storage = getStorage(app)

export const uploadBytes = (path: string, data: any) => {
	return _uploadBytes(ref(storage, path), data)
}

export const uploadString = (path: string, data: any) => {
	return _uploadString(ref(storage, path), data)
}

export const getDownloadURL = (path: string) => {
	return _getDownloadURL(ref(storage, path))
}
