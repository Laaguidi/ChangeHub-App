import * as ImagePicker from 'expo-image-picker';
import { Button, Image, View } from 'react-native';
import React, { useState } from 'react';

const ImagePickerExample = () => {
    const [image, setImage] = useState(null);

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.uri); // Set the image URI to display the selected image
        }
    };

    return (
        <View>
            <Button title="Pick an image from gallery" onPress={pickImage} />
            {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
        </View>
    );
};

export default ImagePickerExample;
