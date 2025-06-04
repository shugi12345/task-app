import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';
import App from './src/App';
import { registerWidget } from './src/widgets/HomeWidget';

registerRootComponent(App);
registerWidget();
