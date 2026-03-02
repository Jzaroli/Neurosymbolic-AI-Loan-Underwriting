// Home Page:
import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import type { Profile } from '../models/Profile.ts';
import { useMutation } from '@apollo/client';
import { SUBMIT_PROFILE } from '../utils/mutations';

const Home = () => {    
    const [profileFormData, setCompanyFormData] = useState<Profile>({ age: '', creditScore: '', monthlyIncome: '', monthlyDebts: '', delinquencies30: '', delinquencies60: '', delinquencies90: '', openedLines: '', unsecuredUsage: '', unsecuredLimit: '', hasIncomeVerification: false, hasBankruptcy: false});
    const [incomeVerificationIsChecked, setIncomeVerificationIsChecked] = useState(false); // Handles boolean for income verification
    const [bankruptcyVerificationIsChecked, setBankruptcyVerificationIsChecked] = useState(false); // Handles boolean for bankruptcy and foreclosure verification
    const [intialError, setIntialError] = useState(false); // Handles early exit error condition
    const [intialErrorMessage, setInitialErrorMessage] = useState(''); // Handles early exit error message
    const [ragResponse, setRagResponse] = useState('') // handles response from entire pipeline
    const [submitProfile, { error }] = useMutation(SUBMIT_PROFILE);

    // Handles input for all strings
    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setCompanyFormData({ ...profileFormData, [name]: value });
    };

    // Set income verification status in form data before form submit
    useEffect(() => {
        if (incomeVerificationIsChecked === false) {
            setCompanyFormData({...profileFormData, hasIncomeVerification: false});
        } else if (incomeVerificationIsChecked === true) {
            setCompanyFormData({...profileFormData, hasIncomeVerification: true});
        }
    }, [incomeVerificationIsChecked]);

    // Set bankruptcy verification status in form data before form submit
    useEffect(() => {
        if (bankruptcyVerificationIsChecked === false) {
            setCompanyFormData({...profileFormData, hasBankruptcy: false});
        } else if (bankruptcyVerificationIsChecked === true) {
            setCompanyFormData({...profileFormData, hasBankruptcy: true});
        }
    }, [bankruptcyVerificationIsChecked]);

    // Timer for errors to disappear
    useEffect(() => {
        if (intialError) {
            setTimeout(() => {
                setIntialError(false);
                setInitialErrorMessage('');
            }, 6000);
        }
    }, [intialError]);

    const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (!(form.age && form.creditScore && form.monthlyIncome && form.monthlyDebts && form.delinquencies30 && form.delinquencies60 && form.delinquencies90 && form.openedLines && form.unsecuredUsage && form.unsecuredLimit)) {
            event.preventDefault();
            event.stopPropagation();
        }

        // Clears results
        setRagResponse('')

        // Converts all string to numbers
        const ageNum = Number(profileFormData.age);
        const creditScoreNum = Number(profileFormData.creditScore);
        const monthlyDebtsNum = Number(profileFormData.monthlyDebts);
        const monthlyIncomeNum = Number(profileFormData.monthlyIncome);
        const debtRatio = (monthlyDebtsNum / monthlyIncomeNum) * 100;
        const delinquencies30Num = Number(profileFormData.delinquencies30);
        const delinquencies60Num = Number(profileFormData.delinquencies60);
        const delinquencies90Num = Number(profileFormData.delinquencies90);
        const openedLinesNum = Number(profileFormData.openedLines);
        const unsecuredUsageNum = Number(profileFormData.unsecuredUsage);
        const unsecuredLimitNum = Number(profileFormData.unsecuredLimit);

        // Business Logic (Initial conditional logic layer of engine)
        if (ageNum < 18 || ageNum > 120) {
            setIntialError(true);
            setInitialErrorMessage('Applicant must be between the ages of 18 and 120.');
            return
        }
        else if (creditScoreNum <= 620 && creditScoreNum >= 300) {
            setIntialError(true);
            setInitialErrorMessage('Applicant credit score must be above 620.');
            return
        } else if (creditScoreNum < 300 || creditScoreNum > 850) {
            setIntialError(true);
            setInitialErrorMessage('Applicant credit score must be between 300 and 850.');
            return
        } 
        else if (debtRatio > 43.00) {
            setIntialError(true);
            setInitialErrorMessage(`Applicant debt to income must be under 43%. Current Percentage: ${debtRatio.toFixed(2)}%`);
            return
        } 
        else if (!profileFormData.hasIncomeVerification) {
            setIntialError(true);
            setInitialErrorMessage('Applicant must be able to provide proof of income.');
            return
        } else if (profileFormData.hasBankruptcy) {
            setIntialError(true);
            setInitialErrorMessage('Applicant must not have any active bankruptcies or foreclosures.');
            return
        }

        try {
            const { data } = await submitProfile({
                variables: { 
                    input: {
                        age: ageNum,
                        creditScore: creditScoreNum,
                        monthlyIncome: monthlyIncomeNum,
                        monthlyDebts: monthlyDebtsNum,
                        delinquencies30: delinquencies30Num,
                        delinquencies60: delinquencies60Num,
                        delinquencies90: delinquencies90Num,
                        openedLines: openedLinesNum,
                        unsecuredUsage: unsecuredUsageNum,
                        unsecuredLimit: unsecuredLimitNum,
                        hasIncomeVerification: profileFormData.hasIncomeVerification,
                        hasBankruptcy: profileFormData.hasBankruptcy,
                    },
                }
            }); 

            setRagResponse(data.submitProfile.result)
        }
        catch (err) {
            console.error(err);
        }
    }

    return (
        <>
            <div className='home'>
                <h1 className='h1'>Neurosymbolic AI System for Loan Underwriting</h1>
                <div className='m-4 justify-start'>
                    <p className='p'> <b>About: </b>Vetting a loan candidate is a risky process. Many factors play into approving a loan, opening the chance for errors in judgement with future defaulters. A hybrid AI model is the perfect architecture for mitigating loan default risks and providing much needed clarity to both parties: <br></br>- A conditional layer approves or denies an applicant based on pass/fail rules. <br></br> - A machine learning model predicts the risk of default for an applicant. <br></br>- A RAG pipeline adds domain intelligence. <br></br>- The final output is processed by an LLM, returning a concise summary of the applicant’s risk profile.</p>
                    <p className='p mt-3'> <b>Note: </b>This app is for demo purposes. Personal information is neither requested nor stored.</p>
                    <p className='max-w-full border-b-2 min-h-[20px]'></p>
                    <h2 className='font-bold underline mt-10 text-lg'>Applicant Form:</h2>
                    <form className='form' noValidate onSubmit={handleFormSubmit}>
                        <p className='ml-1'>Age:</p>
                        <input 
                            className='formInput'
                            type='text' 
                            placeholder='Max 120' 
                            name='age' 
                            onChange={handleInputChange}
                            value={profileFormData.age ?? ''}
                            required
                        />

                        <p className='ml-1'>Credit Score:</p>
                        <input 
                            className='formInput'
                            type='text' 
                            placeholder='Between 300 and 850' 
                            name='creditScore' 
                            onChange={handleInputChange}
                            value={profileFormData.creditScore ?? ''}
                            required
                        />

                        <p className='ml-1'>Total Monthly Income:</p>
                        <input
                            className='formInput'
                            type='text' 
                            placeholder='Income' 
                            name='monthlyIncome' 
                            onChange={handleInputChange}
                            value={profileFormData.monthlyIncome ?? ''}
                            required
                        />
                        
                        <p className='ml-1'>Total Monthly Debt Payments:</p>
                        <input 
                            className='formInput'
                            type='text' 
                            placeholder='Debt Payments' 
                            name='monthlyDebts' 
                            onChange={handleInputChange}
                            value={profileFormData.monthlyDebts ?? ''}
                            required
                        />

                        <p className='ml-1'>Number of Times 30 to 60 Days Past Due on Payments:</p>
                        <input 
                            className='formInput'
                            type='text' 
                            placeholder='30 to 60 Days Past Due' 
                            name='delinquencies30' 
                            onChange={handleInputChange}
                            value={profileFormData.delinquencies30 ?? ''}
                            required
                        />

                        <p className='ml-1'>Number of Times 60 to 90 Days Past Due on Payments:</p>
                        <input 
                            className='formInput'
                            type='text' 
                            placeholder='60 to 90 Days Past Due' 
                            name='delinquencies60' 
                            onChange={handleInputChange}
                            value={profileFormData.delinquencies60 ?? ''}
                            required
                        />

                        <p className='ml-1'>Number of Times 90+ Days Past Due on Payments:</p>
                        <input 
                            className='formInput'
                            type='text' 
                            placeholder='90+ Days Past Due' 
                            name='delinquencies90' 
                            onChange={handleInputChange}
                            value={profileFormData.delinquencies90 ?? ''}
                            required
                        />

                        <p className='ml-1'>Number of Open Credit Lines and Loans:</p>
                        <input 
                            className='formInput'
                            type='text' 
                            placeholder='Credit Lines and Loans' 
                            name='openedLines' 
                            onChange={handleInputChange}
                            value={profileFormData.openedLines ?? ''}
                            required
                        />

                        <p className='ml-1'>Total Debt Owed on Unsecured Lines:</p>
                        <input 
                            className='formInput'
                            type='text' 
                            placeholder='Unsecured Debt' 
                            name='unsecuredUsage' 
                            onChange={handleInputChange}
                            value={profileFormData.unsecuredUsage ?? ''}
                            required
                        />

                        <p className='ml-1'>Total Limit on Unsecured Lines:</p>
                        <input 
                            className='formInput'
                            type='text' 
                            placeholder='Unsecured Limit' 
                            name='unsecuredLimit' 
                            onChange={handleInputChange}
                            value={profileFormData.unsecuredLimit ?? ''}
                            required
                        />

                        <label className='formCheckbox'>
                            <input
                                type="checkbox"
                                checked={incomeVerificationIsChecked}
                                name='hasIncomeVerification'
                                onChange={(e) => setIncomeVerificationIsChecked(e.target.checked)}
                            />
                            <span className='ml-2'>Click this box if you are able to verify your income with statements.</span>
                        </label>

                        <label className='formCheckbox'>
                            <input
                                type="checkbox"
                                checked={bankruptcyVerificationIsChecked}
                                name='hasBankruptcy'
                                onChange={(e) => setBankruptcyVerificationIsChecked(e.target.checked)}
                            />
                            <span className='ml-2'>Click this box if you any active bankruptcies or foreclosures.</span>
                        </label>

                        <button
                            className='submitButton'
                            disabled={!(profileFormData.age && profileFormData.creditScore && profileFormData.monthlyIncome && profileFormData.monthlyDebts && profileFormData.delinquencies30 && profileFormData.delinquencies60 && profileFormData.delinquencies90 && profileFormData.openedLines && profileFormData.unsecuredUsage && profileFormData.unsecuredLimit)}
                            type='submit'
                        >
                            Submit
                        </button>

                        <div className='min-h-[50px]'>
                            {intialError && (
                            <div className='error'>
                                {intialErrorMessage}
                            </div>
                            )}
                            {error && (
                            <div className='error'>
                                {(error.networkError as any)?.statusCode  === 429
                                    ? "You exceeded the limit of 6 candidate profiles per hour."
                                    : error.message
                                }
                            </div>
                            )}
                            {ragResponse && (
                                <p className='m-1 mt-2'><b>Results: </b>{ragResponse}</p>
                            )}
                        </div>
                    </form>
                    <p className='max-w-full border-b-2 min-h-[20px]'></p>
                </div>

            <footer className='mb-6 pb-2 flex flex-row min-w-[50vw] justify-between text-sm italic items-center gap-4'>
                <p> <span className='font-semibold'>Author:</span> Johann Zaroli </p>
                <a className='a' href='https://www.linkedin.com/in/johannzaroli/' target='_blank' rel='noreferrer'> LinkedIn </a>
                <a className='a' href='https://github.com/Jzaroli' target='_blank' rel='noreferrer'> GitHub</a>
            </footer>
            </div>
            
        </>
    )
}

export default Home;
