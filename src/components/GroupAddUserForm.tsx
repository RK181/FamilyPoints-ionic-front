import { IonAlert, IonBackButton, IonButton, IonButtons, IonCardContent, IonContent, IonHeader, IonIcon, IonInput, IonLoading, IonPage, IonTitle, IonToast, IonToolbar, IonicSafeString, setupIonicReact } from '@ionic/react';
import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { useApp } from '../context/AppContext';
import { ValidationErrorResponse, GroupApi, Group, User} from '../api';
import { informationCircleOutline } from 'ionicons/icons';

const GroupAddUserForm: React.FC = () => {
    const navigate = useHistory();
    const {setSession, apiConf} = useApp();
    // Loading Animation
    const [loading, setLoading] = useState<boolean>(false);
    // Form variabels
    const [email, setEmail] = useState<string>('');
    const [formErrors, setFormErrors] = useState<any>();
    // Validation variabels
    const [isTouched, setIsTouched] = useState(false);
    const [isValid, setIsValid] = useState<boolean>();
    // Toast
    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState<string>('');
    const [toastColor, setToastColor] = useState<string>('success');
    // Alert
    const [showInformation, setShowInformation] = useState(false);
    setupIonicReact({
        // For nested html in alert message
        innerHTMLTemplatesEnabled : true,
    });

    const submit = async (event: any) => {
        setFormErrors(null);
        event.preventDefault();
        setLoading(true);

        try {
            var api = new GroupApi(apiConf);

            var response = await api.inviteToGroup(email);
            setToastOpen(true);
            setToastMessage(response.data.message!);
            setToastColor('success');

        } catch (error: any) {
            switch (error.response?.status) {
                case 400:
                    var err = error.response.data as ValidationErrorResponse;
                    setFormErrors(err);
                    break;
                case 401:
                    setToastOpen(true);
                    setToastMessage('The session has expired, please login again.');
                    setToastColor('danger');
                    setSession!(false, '', '');
                    navigate.push('/login');
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
                    <IonTitle>Invite User</IonTitle>
                    <IonButton slot="end" color={'dark'} fill="clear" onClick={() => setShowInformation(true)}>
                        <IonIcon icon={informationCircleOutline}></IonIcon>
                    </IonButton>
                    <IonAlert
                        isOpen={showInformation}
                        onDidDismiss={() => setShowInformation(false)}
                        header="Info. Invite User to Group"
                        message={new IonicSafeString(`
                        <p>Invite a user to the group by entering their email.</p>
                        <ul>
                            <li><small><b>Email</b>: The email of the user to invite needs to be registered and verified.</small></li>
                        </ul>
                        <p><small>*The user will receive an email with a link to confirm the invitation.</small></p>
                        `)}
                        buttons={["Close"]}
                    />
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <IonCardContent>
                    <IonLoading className="custom-loading" isOpen={loading} message="Loading" spinner="circles" />
                    <form onSubmit={submit} >
                        <IonInput
                            className={`
                                ${isValid && 'ion-valid'} 
                                ${(isValid === false || formErrors?.errors['email'] != null) && 'ion-invalid'} 
                                ${isTouched && 'ion-touched'}
                                `}
                            mode="md"
                            type="email"
                            fill="outline"
                            label="Email"
                            labelPlacement="floating"
                            errorText={`${formErrors?.errors['email'] ?? 'Invalid email'}`} 
                            onIonInput={(e) => {validate(e); setEmailError(e.detail.value!)}}
                            onIonBlur={() => markTouched()}
                            placeholder="example@email.com"
                            required
                        ></IonInput>
                        
                        <IonButton type='submit' expand="block" className="ion-margin-top" >
                            Invite User
                        </IonButton>
                    </form>
                </IonCardContent>
                <IonToast
                    isOpen={toastOpen}
                    message={toastMessage}
                    color={toastColor}
                    onDidDismiss={() => setToastOpen(false)}
                    duration={5000}
                ></IonToast>
            </IonContent>
        </IonPage>
    );
};

export default GroupAddUserForm;