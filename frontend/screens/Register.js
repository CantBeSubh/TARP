import { useNavigation } from '@react-navigation/core'
import React, { useEffect, useState } from 'react'
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { Dropdown } from 'react-native-element-dropdown';
import { auth, db } from '../firebase'
import { createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const data = [
    { label: 'Student', value: 'Students' },
    { label: 'Proctor', value: 'Proctors' },
    { label: 'Parent', value: 'Parents' }
];


const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [cpassword, setCpassword] = useState('')
    const [details, setDetails] = useState({})

    const [value, setValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);

    const navigation = useNavigation()

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            if (user) {
                navigation.replace("Home")
            }
        })

        return unsubscribe
    }, [])

    const handleSignUp = () => {
        if (!(details.firstName && details.lastName)) {
            alert("Please enter your name")
            return
        }

        if (password !== cpassword) {
            alert("Passwords don't match")
            return
        }

        if (value === null) {
            alert("Please select a user type")
            return
        }

        createUserWithEmailAndPassword(auth, email.trim(), password)
            .then(userCredentials => {
                const user = userCredentials.user;
                console.log('Registered with:', user.email);
                return setDoc(doc(db, value, user.uid), { ...details, email });
            })
            .then(() => { setDetails({}) })
            .catch(error => alert(error.message))
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior="padding"
        >
            <View style={styles.inputContainer}>


                <TextInput
                    placeholder="First Name"
                    value={details.firstName || ''}
                    onChangeText={text => setDetails({ ...details, firstName: text })}
                    style={styles.input}
                />

                <TextInput
                    placeholder="Last Name"
                    value={details.lastName || ''}
                    onChangeText={text => setDetails({ ...details, lastName: text })}
                    style={styles.input}
                />

                {/* dropdown menu for user type */}
                <Dropdown
                    style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                    data={data}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder={!isFocus ? 'Select Type' : '...'}
                    value={value}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    onChange={item => {
                        setValue(item.value);
                        setIsFocus(false);
                    }}
                />

                <TextInput
                    placeholder="Email"
                    value={email}
                    onChangeText={text => setEmail(text)}
                    style={styles.input}
                />

                <TextInput
                    placeholder="Password"
                    value={password}
                    onChangeText={text => setPassword(text)}
                    style={styles.input}
                    secureTextEntry
                />

                <TextInput
                    placeholder="Confirm Password"
                    value={cpassword}
                    onChangeText={text => setCpassword(text)}
                    style={styles.input}
                    secureTextEntry
                />
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    onPress={handleSignUp}
                    style={[styles.button]}
                >
                    <Text style={styles.buttonText}>Register</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    )
}

export default Login

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputContainer: {
        width: '80%'
    },
    input: {
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
    },
    buttonContainer: {
        width: '60%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
    },
    button: {
        backgroundColor: '#0782F9',
        width: '100%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonOutline: {
        backgroundColor: 'white',
        marginTop: 5,
        borderColor: '#0782F9',
        borderWidth: 2,
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    },
    buttonOutlineText: {
        color: '#0782F9',
        fontWeight: '700',
        fontSize: 16,
    },

    dropdown: {
        height: 45,
        borderColor: 'transparent',
        backgroundColor: 'white',
        borderWidth: 0.5,
        borderRadius: 8,
        // paddingHorizontal: 8,
        marginTop: 5,
        color: 'gray',
    },
    placeholderStyle: {
        backgroundColor: 'white',
        fontSize: 14,
        color: 'gray',
        paddingHorizontal: 15,
        // paddingVertical: 10,
    },
    selectedTextStyle: {
        backgroundColor: 'white',
        color: 'black',
        fontSize: 14,
        paddingHorizontal: 15,
        // paddingVertical: 10,
    },
})
