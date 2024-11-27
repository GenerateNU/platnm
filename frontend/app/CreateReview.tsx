import React, { useEffect, useRef, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';

import {
	View,
	TextInput,
	ScrollView,
	StyleSheet,
	TouchableWithoutFeedback,
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	PanResponder,
} from 'react-native';

import DateInputRating from '@/components/DateInputRating';
import SongCard from '@/components/SongCard';
import HeaderComponent from '@/components/HeaderComponent';
import DraftButton from '@/components/DraftButton';
import PublishButton from '@/components/PublishButton';
import RatingSlider from '@/components/media/RatingSlider';
import { usePublishReview } from '@/hooks/usePublishReview';
import TagSelector from '@/components/media/TagSelector';
import Divider from '@/components/Divider';
import NudgePage from '@/components/NudgePage';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Button } from 'react-native-paper';
import { runOnJS } from 'react-native-reanimated';

const CreateReview = () => {
	const { mediaName, mediaType, mediaId, cover, artistName } = useLocalSearchParams<{
		mediaName: string;
		mediaType: string;
		mediaId: string;
		cover: string;
		artistName: string;
	}>();

	const [rating, setRating] = useState(1);
	const [review, setReview] = useState('');
	const [sliderInteracting, setSliderInteracting] = useState(false);
	const [selectedTags, setSelectedTags] = useState<string[]>([]);

	const [showNudges, setShowNudges] = useState(false);

	const { publishReview } = usePublishReview();

	const handleRatingChange = (newRating: number) => {
		setRating(newRating);
	};

	const handleTagSelect = (tag: string) => {
		if (selectedTags.includes(tag)) {
			const newTags = selectedTags.filter((selectedTag) => selectedTag !== tag);
			setSelectedTags(newTags);
		} else {
			setSelectedTags([...selectedTags, tag]);
		}
	};

	const handleDraftSubmit = () => {
		publishReview(mediaType, parseInt(mediaId), review, rating, selectedTags, true);
	};

	const handlePublish = () => {
		publishReview(mediaType, parseInt(mediaId), review, rating, selectedTags, false);
		setShowNudges(true);
	};

	const handleOutsideClick = () => {
		if (showNudges) {
			setShowNudges(false);
			router.push('/explore');
			console.log('outside click');
		}
	};

	const panResponder = useRef(
		PanResponder.create({
			onStartShouldSetPanResponder: () => true, // Start responder on touch
			onMoveShouldSetPanResponder: (e, gestureState) => {
				// Allow horizontal gestures only
				return Math.abs(gestureState.dx) > Math.abs(gestureState.dy); // Ignore vertical movement
			},
			onPanResponderMove: (e, gestureState) => {
				// Handle the slider movement here
				handleRatingChange(gestureState.moveX); // Update the rating based on horizontal movement
			},
			onPanResponderRelease: (e, gestureState) => {
				// Optionally, handle when the user releases the slider
			},
		}),
	).current;

	const handleScrollBegin = () => {
		console.log('handleScrollBegin');
	};
	const tap = Gesture.Tap()
		.onBegin(() => {
			runOnJS(setSliderInteracting)(true);
		})
		.onTouchesUp(() => {
			runOnJS(setSliderInteracting)(false);
		})
		.onEnd(() => {
			runOnJS(setSliderInteracting)(false);
		})
		.onTouchesCancelled(() => {
			runOnJS(setSliderInteracting)(false);
		});

	return (
		<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
			<HeaderComponent title='Log Song' centered />
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<TouchableWithoutFeedback onPress={handleOutsideClick}>
					<View style={styles.inner}>
						<ScrollView
							scrollEnabled={!sliderInteracting}
							onScrollEndDrag={() => setSliderInteracting(false)}
							contentContainerStyle={styles.scrollview}>
							<SongCard
								mediaName={mediaName}
								mediaType={mediaType}
								cover={cover}
								artistName={artistName}
							/>
							<GestureDetector gesture={tap}>
								<View style={styles.sliderWrapper} {...panResponder.panHandlers}>
									<View style={styles.slider}>
										{/* Render your slider here, adjust based on touch */}
										<View collapsable={false}>
											<RatingSlider onRatingChange={handleRatingChange} />
										</View>
									</View>
								</View>
							</GestureDetector>
							<DateInputRating />
							<Divider />
							<TextInput
								style={styles.textInput}
								multiline={true}
								placeholderTextColor='#434343'
								placeholder='Provide your thoughts...'
								value={review}
								onChangeText={setReview}
							/>
							<Divider />

							<TagSelector tags={selectedTags} handleTagSelect={handleTagSelect} />
							<View style={styles.buttonContainer}>
								<DraftButton handleClick={() => handleDraftSubmit()} />
								<PublishButton handleClick={handlePublish} />
							</View>
						</ScrollView>
						{showNudges && <NudgePage />}
					</View>
				</TouchableWithoutFeedback>
			</TouchableWithoutFeedback>
		</KeyboardAvoidingView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#ffffff',
	},
	inner: {
		flex: 1,
		paddingTop: 20,
	},
	scrollview: {
		flexGrow: 1,
		paddingHorizontal: 24,
		paddingTop: 24,
	},
	keyboardAvoidingView: {
		flex: 1,
	},
	buttonContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingBottom: 30,
		paddingTop: 15,
	},
	textInput: {
		height: 80,
		backgroundColor: '#ffffff',
		fontFamily: 'Roboto',
		color: '#434343',
		fontSize: 16,
		textAlignVertical: 'top',
		justifyContent: 'flex-end',
	},
	sliderWrapper: {
		marginBottom: 20,
		width: '100%',
	},
	slider: {
		//  flexDirection: "row", // Ensures horizontal scrolling
	},
});

export default CreateReview;
