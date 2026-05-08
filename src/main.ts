import './style.css';
import { setRenderer } from './state';
import { render } from './ui/router';

setRenderer(render);
render();
