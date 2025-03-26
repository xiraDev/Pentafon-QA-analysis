const checkCallResult = (callResult) => {
  let result = "";
  switch (callResult) {
    case 21:
      result = "Abandoned";
      break;
    case 47:
      result = "Agent CallBack Error";
      break;
    case 10:
      result = "All Trunks Busy";
      break;
    case 33:
      result = "Answer";
      break;
    case 9:
      result = "Answering Machine Detected";
      break;
    case 31:
      result = "Bridged";
      break;
    case 6:
      result = "Busy";
      break;
    case 42:
      result = "Call Drop Error";
      break;
    case 52:
      result = "Cancel Record";
      break;
    case 19:
      result = "Cleared";
      break;
    case 2:
      result = "Conferenced";
      break;
    case 24:
      result = "Consult";
      break;
    case 30:
      result = "Converse-On";
      break;
    case 29:
      result = "Covered";
      break;
    case 49:
      result = "Deafened";
      break;
    case 41:
      result = "Dial Error";
      break;
    case 51:
      result = "Do Not Call";
      break;
    case 26:
      result = "Dropped";
      break;
    case 27:
      result = "Dropped on No Answer";
      break;
    case 17:
      result = "Fax Detected";
      break;
    case 23:
      result = "Forwarded";
      break;
    case 3:
      result = "General Error";
      break;
    case 48:
      result = "Group CallBack Error";
      break;
    case 50:
      result = "Held";
      break;
    case 7:
      result = "No Answer";
      break;
    case 35:
      result = "No Dial Tone";
      break;
    case 38:
      result = "No Established Detected";
      break;
    case 44:
      result = "No Port Available";
      break;
    case 36:
      result = "No Progress";
      break;
    case 37:
      result = "No RingBack Tone";
      break;
    case 34:
      result = "NU Tone";
      break;
    case 0:
      result = "OK";
      break;
    case 20:
      result = "Overflowed";
      break;
    case 39:
      result = "Pager Detected";
      break;
    case 25:
      result = "Pickedup";
      break;
    case 18:
      result = "Queue Full";
      break;
    case 22:
      result = "Redirected";
      break;
    case 5:
      result = "RemoteRelease";
      break;
    case 32:
      result = "Silence";
      break;
    case 8:
      result = "SIT Detected";
      break;
    case 13:
      result = "SIT IC (Intercept)";
      break;
    case 11:
      result = "SIT Invalid Num";
      break;
    case 15:
      result = "SIT NC (No Circuit)";
      break;
    case 16:
      result = "SIT RO (Reorder)";
      break;
    case 14:
      result = "SIT Unknown Call State";
      break;
    case 12:
      result = "SIT VC (Vacant Code)";
      break;
    case 46:
      result = "Stale";
      break;
    case 43:
      result = "Switch Error";
      break;
    case 4:
      result = "System Error";
      break;
    case 45:
      result = "Transfer Error";
      break;
    case 1:
      result = "Transferred";
      break;
    case 28:
      result = "Unknown Call Result";
      break;
    case 53:
      result = "Wrong Number";
      break;
    case 40:
      result = "Wrong Party";
      break;

    default:
      result = callResult;
      break;
  }

  return result;
};

module.exports = {
  checkCallResult,
};
