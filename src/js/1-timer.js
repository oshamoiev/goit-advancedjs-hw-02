import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const refs = {
  dateTimePicker: document.querySelector('input#datetime-picker'),
  startButton: document.querySelector('button[data-start]'),
  daySpan: document.querySelector('span[data-days]'),
  hourSpan: document.querySelector('span[data-hours]'),
  minuteSpan: document.querySelector('span[data-minutes]'),
  secondSpan: document.querySelector('span[data-seconds]'),
};

function isFutureDate(date) {
  return date.getTime() > Date.now();
}

let selectedDate = null;
refs.startButton.disabled = true;

function initFlatpickr() {
  const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
      if (!isFutureDate(selectedDates[0])) {
        iziToast.show({
          message: 'Please choose a date in the future',
          color: 'red',
          position: 'topRight',
          timeout: 3000,
        });
        refs.startButton.disabled = true;
        return;
      }

      refs.startButton.disabled = false;
      selectedDate = selectedDates[0];
    },
  };

  flatpickr(refs.dateTimePicker, options);
}

initFlatpickr();

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(number) {
  return number < 10 ? `0${number}` : number;
}

function onStartButtonClick() {
  refs.dateTimePicker.disabled = true;
  refs.startButton.disabled = true;

  const intervalId = setInterval(() => {
    const delta = selectedDate.getTime() - Date.now();

    if (delta <= 0) {
      clearInterval(intervalId);
      refs.dateTimePicker.disabled = false;
      return;
    }

    const { days, hours, minutes, seconds } = convertMs(delta);

    refs.daySpan.textContent = addLeadingZero(days);
    refs.hourSpan.textContent = addLeadingZero(hours);
    refs.minuteSpan.textContent = addLeadingZero(minutes);
    refs.secondSpan.textContent = addLeadingZero(seconds);
  }, 1000);
}

refs.startButton.addEventListener('click', onStartButtonClick);
