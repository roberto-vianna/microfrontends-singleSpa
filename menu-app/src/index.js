import ReactDOM from 'react-dom';
import App from './App';

if (!document.getElementById('menu')) {
  ReactDOM.render(<App />, document.getElementById('root'));
}