import ReactDOMClient from 'react-dom/client';
import App from './App';


describe('App.tsx', () => {
    //Taken from https://create-react-app.dev/docs/running-tests/
    it('should render without crashing', () => {
        const div = document.createElement('div');
        ReactDOMClient.createRoot(div).render(<App />);
    })

});
