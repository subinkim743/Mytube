import routes from '../routes';
import Video from '../models/Video';
import fs from 'fs';

export const root = async (req, res) => {
	try {
		const videos = await Video.find({}).sort({ _id: -1 });
		res.render('root', { pageTitle: 'Root', videos });
	} catch (error) {
		console.log(error);
		res.render('root', { pageTitle: 'Root', videos: [] });
	}
};

export const search = async (req, res) => {
	const { query: { term: searchTerm } } = req;
	let videos = [];
	try {
		videos = await Video.find({ title: { $regex: searchTerm, $options: 'i' } });
	} catch (error) {
		console.log(error);
	}
	res.render('search', { pageTitle: 'Search', searchTerm, videos });
};

export const getUpload = (req, res) => res.render('upload', { pageTitle: 'Upload' });

export const postUpload = async (req, res) => {
	const { body: { title, description }, file: { path } } = req;
	const newVideo = await Video.create({
		fileUrl     : path,
		title,
		description
	});
	res.redirect(routes.videoDetail(newVideo.id));
};

export const videoDetail = async (req, res) => {
	const { params: { id } } = req;
	try {
		const video = await Video.findById(id);
		res.render('videoDetail', { pageTitle: video.title, video });
	} catch (error) {
		res.redirect(routes.root);
	}
};

export const getEditVideo = async (req, res) => {
	const { params: { id } } = req;
	try {
		const video = await Video.findById(id);
		res.render('editVideo', { pageTitle: `Edit ${video.title}`, video });
	} catch (error) {
		res.redirect(routes.root);
	}
};

export const postEditVideo = async (req, res) => {
	const { params: { id }, body: { title, description } } = req;
	try {
		await Video.findOneAndUpdate({ _id: id }, { title, description });
		res.redirect(routes.videoDetail(id));
	} catch (error) {
		res.redirect(routes.root);
	}
};

export const deleteVideo = async (req, res) => {
	const { params: { id } } = req;
	const { fileUrl } = await Video.findById(id);
	fs.unlink(fileUrl, (err) => {
		if (err) throw err;
		console.log(`successfully deleted ${fileUrl}`);
	});
	try {
		await Video.findOneAndDelete({ _id: id });
	} catch (error) {}
	res.redirect(routes.root);
};