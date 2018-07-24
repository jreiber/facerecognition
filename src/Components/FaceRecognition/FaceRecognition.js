import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = ({ imageURL, box }) => {
	return (
		<div className='center ma'>
			<div className='absolute mt2'>
				<img 
				id='inputImage' 
				alt='face recognition' 
				width='500px' 
				height='auto' 
				src={imageURL} />
				<div 
				className='bounding-box'
				style={{left: box.leftCol, top: box.topRow, right: box.rightCol, bottom: box.bottomRow}}>
				</div>
			</div>
		</div>
	);
}

export default FaceRecognition;