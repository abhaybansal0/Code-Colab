 
 export default function MeetBtn({ startAMeet, value }) {

  return (
    <button type="button" onClick={startAMeet} 
    className='btn !px-6 btn-white glow  ps-4'>
      {value? value : 'Start'} 
    </button>
  )
}