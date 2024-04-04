import { IonButton, IonCardContent, IonContent, IonHeader, IonInput, IonLoading, IonPage, IonText, IonTitle, IonToolbar } from '@ionic/react';
import React, { useState } from 'react';
import { ApiResponse, AuthApi, ValidationErrorResponse } from '../api';
import { useApp } from '../context/AppContext';
import { Redirect, useHistory } from 'react-router';

const LoginForm: React.FC = () => {
    const navigate = useHistory();
    const {isAuthenticated, apiConf, setSession} = useApp();
    // Loading Animation
    const [loading, setLoading] = useState<boolean>(false);
    // Form variabels
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [formErrors, setFormErrors] = useState<ValidationErrorResponse>();
    const [formErrors401, setFormErrors401] = useState<string>('');
    // Validation variabels
    const [isTouched, setIsTouched] = useState(false);
    const [isValid, setIsValid] = useState<boolean>();

    const submit = async (event: any) => {
        event.preventDefault();
        setLoading(true);
        setFormErrors(undefined);
        setFormErrors401('');

        try {
            var api = new AuthApi(apiConf);
            var response = await api.loginUser({ email: email, password: password});
            setSession!(true, response.data.token as string, email)
            console.log('auth: ' + isAuthenticated + ' Token: ' + apiConf!.accessToken)
            // Redirect to group page
            navigate.push("/group");

        } catch (error: any) {
            switch (error.response?.status) {
                case 400:
                    var err = error.response.data as ValidationErrorResponse;
                    setFormErrors(err);
                    break;
                case 401:
                    var err401 = error.response.data as ApiResponse;
                    setFormErrors401(err401.message!);
                    break;
                default:
                    // Handle other cases if needed
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
                    className={`
                        ${isValid && 'ion-valid'} 
                        ${isValid === false && 'ion-invalid'} 
                        ${isTouched && 'ion-touched'}
                        ${formErrors?.errors?.email ? 'ion-invalid ion-touched' : null} 
                        ${formErrors401 ? 'ion-invalid ion-touched' : null}`}
                    mode="md"
                    type="email"
                    fill="outline"
                    label="Email"
                    labelPlacement="floating"
                    errorText={`${formErrors?.errors?.email ?? (formErrors401 ? '' : 'Invalid email')}`} 
                    onIonInput={(e) => {validate(e); setEmail(e.detail.value!); setFormErrors401(''); setFormErrors(undefined);}}
                    onIonBlur={() => markTouched()}
                    placeholder="example@email.com"
                    required
                ></IonInput>
                
                <IonInput
                id='password'
                    className={` ion-margin-top
                    ${formErrors?.errors?.password ? 'ion-invalid ion-touched' : null} 
                    ${formErrors401 ? 'ion-invalid ion-touched' : null}`}
                    mode="md"
                    type="password"
                    fill="outline"
                    label="Password"
                    labelPlacement="floating"
                    minlength={2}
                    errorText={`${formErrors?.errors?.password ?? ''}`} 
                    onIonInput={(e) => {setPassword(e.detail.value!); setFormErrors401(''); setFormErrors(undefined);}}
                    placeholder="password"
                    required
                ></IonInput>
                <IonText className='ion-margin-top' color="danger">
                    {formErrors401 ?? ''}
                </IonText>
                
                <IonButton type='submit' expand="block" className="ion-margin-top" >
                    Login
                </IonButton>
                <IonButton routerLink="/signup" color={'secondary'} type="button" expand="block" className="ion-margin-top">
                    Create account
                </IonButton>
            </form>
        </IonCardContent>
    );
};

export default LoginForm;
