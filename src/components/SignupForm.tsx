import { IonButton, IonCardContent, IonContent, IonHeader, IonInput, IonItem, IonLoading, IonPage, IonRedirect, IonText, IonTitle, IonToolbar } from '@ionic/react';
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

    const submit = async (event: any) => {
        event.preventDefault();
        setLoading(true);

        try {
            var api = new AuthApi(apiConf);
            await api.signupUser({ name: name, email: email, password: password});
            navigate.push("/login");
        } catch (error: any) {
            if (error.response?.status == 400) {
                var err = error.response.data as ValidationErrorResponse;
                setFormErrors(err);
            }
            
            /*setFormErrors( (error.response &&
                error.response.data &&
                error.response.data.errors.email[0]) ||
              error.message ||
              error.toString());*/
            
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

    const validate = (ev: Event) => {
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
                    onIonChange={(e) => setName(e.detail.value!)}
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
                    onIonInput={(e) => validate(e)}
                    onIonBlur={() => markTouched()}
                    onIonChange={(e) => setEmail(e.detail.value!)}
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
                    onIonChange={(e) => setPassword(e.detail.value!)}
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
        </IonCardContent>
    );
};

export default LoginForm;
