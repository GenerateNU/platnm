import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Image } from 'react-native';
import axios from 'axios';

import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';

import { RNS3 } from 'react-native-aws3';
import { useAuthContext } from '@/components/AuthProvider';
type Props = {
	uri: string;
	editing: boolean;
};

const ProfilePicture = ({ uri, editing }: Props) => {
	const { userId } = useAuthContext();
	const [activeUri, setUri] = useState(uri);

	const pick = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			allowsEditing: false,
			allowsMultipleSelection: true,
			quality: 1,
			orderedSelection: true,
		});
		console.log(result);
		if (!result.canceled) {
			onDone(result.assets, true);
		}
	};

	const onDone = (assets: any, isSelected: boolean) => {
		console.log(assets);
		console.log(isSelected);

		const [asset] = assets;
		const { uri, fileName, mimeType } = asset;

		const file = {
			uri: uri,
			name: fileName,
			type: mimeType,
		};

		const options = {
			bucket: 'playground-bucket-beak',
			region: 'us-east-2',
			accessKey: process.env.EXPO_PUBLIC_AWS_ACCESS_KEY_ID as string,
			secretKey: process.env.EXPO_PUBLIC_AWS_SECRET_ACCESS_KEY as string,
			successActionStatus: 201,
		};

		RNS3.put(file, options)
			.then(async (res) => {
				console.log(res);
				if (res.status == 201) {
					// @ts-ignore
					let newUri = res.body.postResponse.location;
					let updatePfp = await axios.patch(`${process.env.EXPO_PUBLIC_BASE_URL}/users/pfp/${userId}`, {
						profile_picture: newUri,
					});
					setUri(newUri);
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const openPicker = async () => {
		if (!editing) return;
		const { status } = await MediaLibrary.getPermissionsAsync();
		console.log(status);
		if (status != 'granted') {
			const newPerms = await MediaLibrary.requestPermissionsAsync();
			console.log(newPerms);
			// @ts-ignore
			if (newPerms == MediaLibrary.PermissionStatus.GRANTED) {
				pick();
			}
		} else {
			pick();
		}
	};

	const handleProfilePicturePress = () => {
		console.log('Profile picture pressed');
		openPicker();
	};

	return (
		<TouchableOpacity onPress={handleProfilePicturePress} style={styles.profileImage}>
			<Image
				source={{ uri: activeUri }} // Use uri for remote images
				style={styles.profileImage}
				resizeMode='cover'
			/>
		</TouchableOpacity>
	);
};

export default ProfilePicture;

const styles = StyleSheet.create({
	profileImage: {
		position: 'absolute', // Overlay the profile picture on the record
		width: 90, // Adjust size to fit within the center of the record
		height: 90, // Adjust size to fit within the center of the record
		borderRadius: 90, // To make it circular
		borderWidth: 2, // Optional: add a border around the profile image
		// borderColor: '#fff', // Optional: white border
	},
});
