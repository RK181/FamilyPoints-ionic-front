import { IonButton, IonCardContent, IonContent, IonHeader, IonInput, IonItem, IonLoading, IonPage, IonRedirect, IonText, IonTitle, IonToast, IonToolbar } from '@ionic/react';
import React, { useState } from 'react';
import { AuthApi, ValidationErrorResponse } from '../api';
import { useApp } from '../context/AppContext';
import { useHistory } from 'react-router-dom';

const LoginForm: React.FC = () => {
    const {apiConf} = useApp();
    const navigate = useHistory();
    // Loading Animation
    const [loading, setLoading] = useState<boolean>(false);
    // Form variabels
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [ formErrors, setFormErrors ] = useState<ValidationErrorResponse>();
    // Validation variabels
    const [isTouched, setIsTouched] = useState(false);
    const [isValid, setIsValid] = useState<boolean>();
    // Toast
    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState<string>('');
    const [toastColor, setToastColor] = useState<string>('success');


    const submit = async (event: any) => {
        event.preventDefault();
        setLoading(true);

        try {
            var api = new AuthApi(apiConf);
            var response = await api.signupUser({ name: name, email: email, password: password});
            setToastOpen(true);
            setToastMessage(response.data.message!);
            setToastColor('success');
            navigate.push("/login");
        } catch (error: any) {
            switch (error.response?.status) {   
                case 400:
                    var err = error.response.data as ValidationErrorResponse;
                    setFormErrors(err);
                    break;
                case 500:
                    setToastOpen(true);
                    setToastMessage('Internal server error, please try again later.');
                    setToastColor('danger');
                    break;
                default:
                    setToastOpen(true);
                    setToastMessage('An error occurred, please try again later.');
                    setToastColor('danger');
                    break;
            }
        } finally {
            setLoading(false);
        }
    }

    // VALIDATION
    const validateEmail = (email: string) => {
        return email.match(
        /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
        );
    };

    const validate = (ev: any) => {
        const value = (ev.target as HTMLInputElement).value;
        setIsValid(undefined);
        if (value === '') return;

        validateEmail(value) !== null ? setIsValid(true) : setIsValid(false);
    };

    const markTouched = () => {
        setIsTouched(true);
    };

    return (
        <IonCardContent>
            <IonLoading className="custom-loading" isOpen={loading} message="Loading" spinner="circles" />
            <form onSubmit={submit} >
                <IonInput
                    mode="md"
                    type="text"
                    fill="outline"
                    label="Name"
                    labelPlacement="floating"
                    minlength={2}
                    errorText={`${formErrors?.errors?.name ?? null}`} 
                    onIonInput={(e) => setName(e.detail.value!)}
                    placeholder="name"
                    required
                ></IonInput>

                <IonInput
                    className={`ion-margin-top 
                        ${isValid && 'ion-valid'} 
                        ${isValid === false && 'ion-invalid'} 
                        ${isTouched && 'ion-touched'}`}
                    mode="md"
                    type="email"
                    fill="outline"
                    label="Email"
                    labelPlacement="floating"
                    errorText={`${formErrors?.errors?.email ?? 'Invalid email'}`} 
                    onIonInput={(e) => {validate(e); setEmail(e.detail.value!);}}
                    onIonBlur={() => markTouched()}
                    placeholder="example@email.com"
                    required
                ></IonInput>

                <IonInput
                    className="ion-margin-top"
                    mode="md"
                    type="password"
                    fill="outline"
                    label="Password"
                    labelPlacement="floating"
                    minlength={2}
                    errorText={`${formErrors?.errors?.password ?? null}`} 
                    onIonInput={(e) => setPassword(e.detail.value!)}
                    placeholder="password"
                    required
                ></IonInput>
            
                
                <IonButton type='submit' expand="block" className="ion-margin-top" >
                    Create account
                </IonButton>


                <IonButton routerLink="/login" color={'secondary'} type="button" expand="block" className="ion-margin-top">
                    Login
                </IonButton>
            </form>
            <IonToast
                isOpen={toastOpen}
                message={toastMessage}
                color={toastColor}
                onDidDismiss={() => setToastOpen(false)}
                duration={5000}
            ></IonToast>
        </IonCardContent>
    );
};

export default LoginForm;
