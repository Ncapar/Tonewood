
const tonewoodData = {
    "Mahogany": {
        eq: [3, 3, 1, -1, -2, -3],
        harmonics: [1.0, 0.6, 0.4, 0.3, 0.2, 0.1],
        envelope: {attack: 0.1, decay: 2}
    },
    "Swamp Ash": {
        eq: [2, 1, 0, 0, 2, 3],
        harmonics: [1.0, 0.85, 0.65, 0.5, 0.35, 0.25],
        envelope: {attack: 0.06, decay: 2.8}
    },
    "Alder": {
        eq: [1, 1, 1, 1, 1, 1],
        harmonics: [1.0, 0.8, 0.65, 0.45, 0.3, 0.2],
        envelope: {attack: 0.05, decay: 2.5}
    },
    "Ziricote": {
        eq: [2, 2, 2, 1, 0, 1],
        harmonics: [1.0, 0.9, 0.75, 0.5, 0.3, 0.2],
        envelope: {attack: 0.06, decay: 2.7}
    },
    "Purpleheart": {
        eq: [1, 1, 2, 2, 2, 2],
        harmonics: [1.0, 0.85, 0.7, 0.55, 0.4, 0.3],
        envelope: {attack: 0.05, decay: 3}
    },
    "Basswood": {
        eq: [1, 1, 0, 0, 0, -1],
        harmonics: [1.0, 0.7, 0.5, 0.35, 0.25, 0.15],
        envelope: {attack: 0.07, decay: 2.2}
    },
    "Koa": {
        eq: [2, 2, 1, 1, 2, 2],
        harmonics: [1.0, 0.8, 0.6, 0.45, 0.35, 0.25],
        envelope: {attack: 0.06, decay: 2.6}
    },
    "Limba": {
        eq: [2, 2, 1, 0, 1, 2],
        harmonics: [1.0, 0.75, 0.6, 0.45, 0.3, 0.2],
        envelope: {attack: 0.06, decay: 2.4}
    },
    "Maple": {
        eq: [0, 0, 1, 2, 3, 3],
        harmonics: [1.0, 0.8, 0.6, 0.4, 0.3, 0.2],
        envelope: {attack: 0.04, decay: 3.2}
    },
    "Ebony": {
        eq: [1, 1, 2, 2, 3, 3],
        harmonics: [1.0, 0.9, 0.8, 0.6, 0.4, 0.3],
        envelope: {attack: 0.04, decay: 3.5}
    },
    "Walnut": {
        eq: [2, 2, 1, 0, 1, 2],
        harmonics: [1.0, 0.75, 0.55, 0.4, 0.3, 0.2],
        envelope: {attack: 0.06, decay: 2.5}
    },
    "Okoume": {
        eq: [2, 2, 0, -1, -1, 0],
        harmonics: [1.0, 0.65, 0.5, 0.35, 0.25, 0.15],
        envelope: {attack: 0.07, decay: 2.1}
    }
};

const freqLabels = [80, 200, 500, 1000, 3000, 6000];
const harmonicLabels = ["Fund", "2nd", "3rd", "4th", "5th", "6th"];

let eqChart, harmonicsChart, envelopeChart;

function updateCharts() {
    const selected = [...document.querySelectorAll('#controls input:checked')].map(el => el.value);

    const eqDatasets = selected.map(wood => ({
        label: wood,
        data: tonewoodData[wood].eq,
        fill: false,
        borderWidth: 2
    }));

    const harmonicDatasets = selected.map(wood => ({
        label: wood,
        data: tonewoodData[wood].harmonics,
        backgroundColor: 'rgba(0,0,0,0.1)',
        borderWidth: 1
    }));

    const time = Array.from({length: 150}, (_, i) => i * 0.01);
    const envelopeDatasets = selected.map(wood => {
        const {attack, decay} = tonewoodData[wood].envelope;
        const envelope = time.map(t => t < attack ? t / attack : Math.exp(-decay * (t - attack)));
        return {
            label: wood,
            data: envelope,
            fill: false,
            borderWidth: 2
        };
    });

    if (eqChart) eqChart.destroy();
    if (harmonicsChart) harmonicsChart.destroy();
    if (envelopeChart) envelopeChart.destroy();

    eqChart = new Chart(document.getElementById('eqChart'), {
        type: 'line',
        data: {
            labels: freqLabels,
            datasets: eqDatasets
        },
        options: {
            responsive: true,
            scales: {
                x: { type: 'logarithmic', title: { display: true, text: 'Frequency (Hz)' } },
                y: { title: { display: true, text: 'EQ Emphasis (dB)' } }
            }
        }
    });

    harmonicsChart = new Chart(document.getElementById('harmonicsChart'), {
        type: 'bar',
        data: {
            labels: harmonicLabels,
            datasets: harmonicDatasets
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true, title: { display: true, text: 'Harmonic Amplitude' } }
            }
        }
    });

    envelopeChart = new Chart(document.getElementById('envelopeChart'), {
        type: 'line',
        data: {
            labels: time,
            datasets: envelopeDatasets
        },
        options: {
            responsive: true,
            scales: {
                x: { title: { display: true, text: 'Time (s)' } },
                y: { title: { display: true, text: 'Amplitude' }, min: 0, max: 1.1 }
            }
        }
    });
}
