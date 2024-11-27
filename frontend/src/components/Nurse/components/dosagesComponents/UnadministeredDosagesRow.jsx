import 'react-toastify/dist/ReactToastify.css';

const unadminiteredDosagesRow = ({ dosage}) => {
    return (
        <div className="animate-fade-in-up bg-white rounded-lg p-5 shadow-lg relative my-5 mx-5">
            <h4 className="text-lg font-bold text-primary">{dosage.patientname}</h4>
            <p className="text-sm text-gray-600">
                <strong className='text-[#3554a4]'>Patient mrID: </strong> {dosage.mrid}
            </p>
            <p className="text-sm text-gray-600">
                <strong className='text-[#3554a4]'>{dosage.formulaname}</strong>
            </p>
            <p className="text-sm text-gray-600">
                <strong className='text-[#3554a4]'>Dosage ID: </strong>{dosage.dosageid}
            </p>
            <p className="text-sm text-gray-600">
                <strong className='text-[#3554a4]'>Dosage Time: </strong>{dosage.time}
            </p>
            <p className="text-sm text-gray-600">
                <strong className='text-red-500'>Pending</strong>
            </p>
        </div>
    );
};

export default unadminiteredDosagesRow;
