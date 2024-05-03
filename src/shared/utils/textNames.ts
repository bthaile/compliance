
export function capitalizeWord(word: string) {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

export function lookupBankName(lenderCode: string, lenderNames: { lenderCode: string, lenderName: string }[]) {
    const bank = lenderNames.find(l => l.lenderCode === lenderCode);
    return bank?.lenderName || lenderCode;
}
