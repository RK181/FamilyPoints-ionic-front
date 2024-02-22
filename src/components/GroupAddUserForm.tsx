import { IonBackButton, IonButton, IonButtons, IonCardContent, IonContent, IonHeader, IonInput, IonLoading, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { useApp } from '../context/AppContext';
import { ValidationErrorResponse, GroupApi, Group, User} from '../api';

const GroupAddUserForm: React.FC = () => {
    const navigate = useHistory();
    const {isAuthenticated, apiConf} = useApp();
    // Loading Animation
    const [loading, setLoading] = useState<boolean>(false);
    // Form variabels
    const [email, setEmail] = useState<string>('');
    const [formErrors, setFormErrors] = useState<any>();
    // Validation variabels
    const [isTouched, setIsTouched] = useState(false);
    const [isValid, setIsValid] = useState<boolean>();

    const submit = async (event: any) => {
        event.preventDefault();
        setLoading(true);
        console.log('ionViewDidEnter event fired');


        try {
            var api = new GroupApi(apiConf);
            var group: Group;
            var couple: User;
            couple = {email: email};
            group = {couple: couple};

            await api.updateGroup(group);
            navigate.push("/group");

        } catch (error: any) {
            if (error.response?.status == 400) {
                var err = error.response.data as ValidationErrorResponse;
                setFormErrors(err);
            }
        console.log(error);
            
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

    const validate = (ev: any) => {
        const value = (ev.target as HTMLInputElement).value;
        setIsValid(undefined);
        if (value === '') return;
        validateEmail(value) !== null ? setIsValid(true) : setIsValid(false);
    };

    const markTouched = () => {
        setIsTouched(true);
    };

    const setEmailError = (e: any) => {
        setEmail(e)
        setFormErrors(null)
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton></IonBackButton>
                    </IonButtons>
                    <IonTitle>Add User</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <IonCardContent>
                    <IonLoading className="custom-loading" isOpen={loading} message="Loading" spinner="circles" />
                    <div>Auth: {isAuthenticated ? 'true':'false'}</div>
                    <form onSubmit={submit} >
                        <IonInput
                            className={`
                                ${isValid && 'ion-valid'} 
                                ${(isValid === false || formErrors?.errors['couple.email'] != null) && 'ion-invalid'} 
                                ${isTouched && 'ion-touched'}
                                `}
                            mode="md"
                            type="email"
                            fill="outline"
                            label="Email"
                            labelPlacement="floating"
                            errorText={`${formErrors?.errors['couple.email'] ?? 'Invalid email'}`} 
                            onIonInput={(e) => validate(e)}
                            onIonBlur={() => markTouched()}
                            onIonChange={(e) => setEmailError(e.detail.value!)}
                            placeholder="example@email.com"
                            required
                        ></IonInput>
                        
                        <IonButton type='submit' expand="block" className="ion-margin-top" >
                            Add User
                        </IonButton>
                    </form>
                </IonCardContent>
            </IonContent>
        </IonPage>
    );
};

export default GroupAddUserForm;