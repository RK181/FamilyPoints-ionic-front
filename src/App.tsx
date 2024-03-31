import { Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import Login from './pages/Login';
import SignUp from './pages/Signup';
import {AppProvider } from './context/AppContext';
import Group from './pages/Group';
import Menu from './components/Menu';
import GroupInfo from './components/GroupInfo';
import GroupCreateForm from './components/GroupCreateForm';
import GroupAddUserForm from './components/GroupAddUserForm';
import RewardCreateForm from './components/RewardCreateForm';
import RewardList from './components/RewardList';
import TaskCreateForm from './components/TaskCreateForm';
import TaskList from './components/TaskList';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
      <IonReactRouter>
        <Menu />
        <IonRouterOutlet id="main">
          <Route exact path="/home">
            <Home />
          </Route>
          <Route exact path="/login">
            <Login />
          </Route>
          <Route exact path="/signup">
            <SignUp />
          </Route>
          <Route exact path="/group">
            <Group />
          </Route>
          <Route exact path="/groupform">
            <GroupCreateForm />
          </Route>
          <Route exact path="/groupAddUser">
            <GroupAddUserForm />
          </Route>
          <Route exact path="/rewardForm">
            <RewardCreateForm />
          </Route>
          <Route exact path="/rewardList">
            <RewardList />
          </Route>
          <Route exact path="/taskForm">
            <TaskCreateForm />
          </Route>
          <Route exact path="/taskList">
            <TaskList />  
          </Route>

        </IonRouterOutlet>
      </IonReactRouter>
  </IonApp>
);

export default App;
