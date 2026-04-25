import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form');

function createPromise(state, delay) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === 'fulfilled') {
        resolve(delay);
      } else {
        reject(delay);
      }
    }, delay);
  });
}

function processPromise(promise) {
  promise
    .then(delay => {
      iziToast.show({
        message: `✅ Fulfilled promise in ${delay}ms`,
        color: 'green',
        position: 'topRight',
        timeout: 3000,
      });
    })
    .catch(delay => {
      iziToast.show({
        message: `❌ Rejected promise in ${delay}ms`,
        color: 'red',
        position: 'topRight',
        timeout: 3000,
      });
    });
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const delay = parseInt(form.delay.value, 10);
  const state = form.state.value;

  if (!delay || !state) {
    alert('Fill please all fields');
    return;
  }

  const promise = createPromise(state, delay);
  processPromise(promise);

  form.reset();
});
