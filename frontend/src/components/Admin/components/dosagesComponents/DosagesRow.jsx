import 'react-toastify/dist/ReactToastify.css';

const DosagesRow = ({ dosage}) => {
    return (
        <div className="animate-fade-in-up bg-white rounded-lg p-5 shadow-lg relative my-5 mx-5">
            <h4 className="text-lg font-bold text-primary">{dosage.patientname}</h4>
            <p className="text-sm text-gray-600">
                <strong className='text-[#3554a4]'>Patient mrID: </strong> {dosage.mrid}
            </p>
            <p className="text-sm text-gray-600">
                <strong className='text-[#3554a4]'>dosage ID: </strong>{dosage.dosageid}
            </p>
            <p className="text-sm text-gray-600">
                <strong className='text-[#3554a4]'>Dosage Time: </strong>{dosage.time}
            </p>
            <p className="text-sm text-gray-600">
                {dosage.administered ? <><strong className='text-[#1AAC5C]'>Administered </strong></> : <strong className='text-red-500'>Pending</strong>}
            </p>
            {dosage.nurseid && dosage.administered ?
                <>
                    <p className='mt-2 text-md text-[#3554a4]'><strong>Administered By:</strong></p>
                    <p className="text-sm pl-2 text-gray-600">
                        <strong >Nurse ID: </strong>{dosage.nurseid}
                    </p>
                    <p className="text-sm pl-2 text-gray-600">
                        <strong>Nurse Name: </strong>{dosage.nursename}
                    </p>
                </>:<></>
            }
        </div>
    );
};

export default DosagesRow;
