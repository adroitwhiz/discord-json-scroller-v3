import JSZip from 'jszip';

export default file => new Promise((resolve, reject) => {
	const reader = new FileReader();
	reader.addEventListener('load', event => {
		const data = event.target.result;
		const dv = new DataView(event.target.result);

		const resolveDecode = data => {
			const decoded = (new TextDecoder()).decode(data);
			resolve(JSON.parse(decoded));
		};

		if (
			// zip file signature
			dv.getInt8(0) === 0x50 &&
			dv.getInt8(1) === 0x4b &&
			dv.getInt8(2) === 0x03 &&
			dv.getInt8(3) === 0x04
		) {
			JSZip.loadAsync(data)
				.then(zip => {
					const files = Object.values(zip.files);
					if (files.length !== 1) throw new Error('No file found in .zip');
					return zip.file(files[0].name).async('arraybuffer');
				})
				.then(data => {
					resolveDecode(data);
				});
		} else {
			resolveDecode(data);
		}
	});

	reader.addEventListener('error', event => {
		reject(event.target.error);
	});

	reader.readAsArrayBuffer(file);
});
