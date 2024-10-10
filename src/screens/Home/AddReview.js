import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    Modal,
} from 'react-native';
import Star from '../../assets/svg/star.svg'; // Assuming you have star icons
import DarkStar from '../../assets/svg/darkStar.svg'; // Assuming you have star icons
import { useDispatch, useSelector } from 'react-redux';
import MyButton from '../../elements/MyButton';
import { DOMAIN } from '../../services/Config';
import { errorToast } from '../../utils/customToast';


export default function AddReviewModal({ item, visible, onClose }) {
    const userDetails = useSelector((state) => state?.user?.user)
    const [rating, setRating] = useState(0); // Initial star rating
    const [comment, setComment] = useState('');
    const dispatch = useDispatch();
    const StarData = [1, 2, 3, 4, 5]; // Star data for rendering stars

    const handleSubmit = () => {
        // Handle the submission logic here
        onClose(); // Close the modal after submission
    };


    const getRatingFeedback = (rating) => {
        switch (rating) {
            case 1:
                return { emoji: '😞', text: 'Very Bad' };
            case 2:
                return { emoji: '😕', text: 'Bad' };
            case 3:
                return { emoji: '😐', text: 'Okay' };
            case 4:
                return { emoji: '😊', text: 'Good' };
            case 5:
                return { emoji: '😄', text: 'Excellent' };
            default:
                return { emoji: '🙂', text: 'Rate your experience' };
        }
    };
    const feedback = getRatingFeedback(rating); // Get the feedback based on the current rating
    const _addReview = async() => {


        if(!comment || !rating) return errorToast('Please enter ratting our review')
        var formdata = new FormData();

        formdata.append("user_id", userDetails?.id);
        formdata.append("product_id", item?.id);
        formdata.append("message", comment);
        formdata.append("rating", rating);
  
   

        const requestOptions = {
            method: "POST",
            body: formdata,
            redirect: "follow",
        };
      await  fetch(`${DOMAIN}add-review`, requestOptions)
            .then((response) => response.json())
            .then(async (res) => {
                if (res.status == "1") {
                   onClose()
                   setComment('')
                   setRating(0)
                }
            }).catch((err) => {
                console.log("err", err)
            }).finally(() => {
                setLoading(false)
            })
    }

    return (
        <Modal
            transparent={true}
            visible={visible}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                <View style={styles.feedbackContainer}>
                        {/* Emoji and feedback text */}
                        <Text style={styles.feedbackEmoji}>{feedback.emoji}</Text>
                        <Text style={styles.feedbackText}>{feedback.text}</Text>
                    </View>
                    <View style={styles.starRatingContainer}>
                        {StarData.map((_, index) => (
                            <TouchableOpacity
                                style={{ marginLeft: 10 }}
                                key={index} onPress={() => setRating(index + 1)}>
                                {index < rating ? (
                                    <Star height={25} width={25} />
                                ) : (
                                    <DarkStar height={25} width={25} fill="#84888F" />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={styles.commentContainer}>
                        <TextInput
                            multiline
                            style={styles.commentInput}
                            placeholder="Comment your review."
                            value={comment}
                            onChangeText={(text) => setComment(text)}
                        />
                    </View>

                    {/* <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                        <Text style={styles.submitButtonText}>Submit</Text>
                    </TouchableOpacity> */}

                    <MyButton onPress={() => {_addReview()}}
                        textStyle={{ fontWeight: '700' }}
                        title={"Submit"} style={{ borderRadius: 12,paddingHorizontal:60}} />
                    

                   
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    feedbackContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    feedbackEmoji: {
        fontSize: 40,
    },
    feedbackText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#7e9dcf',
        marginTop:10
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '90%',
        backgroundColor: '#FFF',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        paddingVertical:30
    },
    starRatingContainer: {
        flexDirection: 'row',
        marginTop: 10,
        padding: 10,
        alignSelf: 'center',
    },
    commentContainer: {
        marginVertical: 10,
        paddingHorizontal: 10,
        backgroundColor: '#F7F8F8',
        borderRadius: 10,
        paddingVertical:10,
        width:'80%',
     
    },
    commentInput: {
        fontSize:14,
        fontStyle: '600',
        color: '#000',
    },
    submitButton: {
        backgroundColor: '#352C48',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
        height: 60,
        marginTop: 20,
        width: '100%',
    },
    submitButtonText: {
        color: '#FFF',
        fontSize: 17,
        fontWeight: '600',
        lineHeight: 25.5,
    },
  
    closeButtonText: {
        color: '#352C48',
        fontSize: 17,
    },
});
