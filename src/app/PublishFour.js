const [date, setDate] = React.useState(new Date(1598051730000));
const [mode, setMode] = React.useState('date');
const [show, setShow] = React.useState(false);

const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
};

const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
}

const showDatepicker = () => {
    showMode('date');
}

const showTimepicker = () => {
    showMode('time');
}

const handlePublish = () => {
    if (title && background && context && option1 && option2 && date) {
        updateMessage("");
        updateIsLoading(true);
        axios.post("https://trywhistle.app/api/app/makewhistle", 
        {
            "title": title,
            "background": background,
            "context": context,
            "options": {
                option1: 0, 
                option2: 0,
            },
            "closeDateTime": date,
        },
        {
            headers: {
                "x-access-token": jwtToken
            }
        })
        .then(resp => {
            updateIsSuccessful(true);
        })
        .catch(err => {
            updateMessage(err);
        });
    } else {
        updateMessage("All fields must be filled to blow a Whistle.")
    }
}