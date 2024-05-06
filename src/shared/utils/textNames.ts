
export function capitalizeWords(sentence: string, cutLength = -1) {
    const capitalizedSentence = sentence.split(' ').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');

    if (cutLength > 0 && capitalizedSentence.length > cutLength) {
        return capitalizedSentence.substring(0, cutLength) + "...";
    }

    return capitalizedSentence;
}


export function lookupBankName(lenderCode: string, lenderNames: { lenderCode: string, lenderName: string }[]) {
    const bank = lenderNames.find(l => l.lenderCode === lenderCode);
    return bank?.lenderName || lenderCode;
}
