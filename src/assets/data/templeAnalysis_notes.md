# JSON Structure Summary

The JSON data describes information related to lenders, their codes, and various metrics pertaining to loan rankings and fair lending practices for different years. It's organized into two primary sections: `lenderNames` and `loanRankings`.

## `lenderNames`
This array lists lenders, each with a `lenderCode` and `lenderName`. For example:
- **Lender Code:** `5493000NYUJT9UC6G261`
- **Lender Name:** `LEADERONE FINANCIAL CORP.`

## `loanRankings`
This array includes data for different years, focusing on loan rankings within specified peer groups and loan types. Each entry details the year, peer group range (`peerGroupMin`, `peerGroupMax`), `loanType`, and an array of `fairLendingCounts`. Additionally, it presents `goalStatus` information for assessing performance against fair lending goals.

### Details
- **Year:** The year for the loan data, e.g., `2021`.
- **Peer Group Range:** Specifies the minimum and maximum of the peer group for comparison, e.g., `peerGroupMin: 156`, `peerGroupMax: 626`.
- **Loan Type:** Indicates the type of loan data, such as `ALL`, `FIRST`, `SECOND`.
- **Fair Lending Counts:** Breaks down loan counts by different fair lending types (`Total`, `LMIArea`, `MinorityArea`, etc.), each with detailed counts and percentages for each lender.

#### Fair Lending Types Include:
- **Total**
- **LMIArea** (Low and Moderate Income Area)
- **MinorityArea**
- **HispanicArea**
- **AAArea** (African American Area)
- **HispanicIndividual**
- **AAIndividual** (African American Individual)

#### Goal Status
- Indicates goals and adjustments (`goalAdj`), counts (`goalCount`), and percentages (`goalPct`) for various fair lending types, comparing them to actual figures (`myCount`, `myPct`).

## Observations
The JSON data is rich with information on lending practices, focusing on compliance with fair lending standards and peer group comparisons. It can be used for analysis, reporting, and monitoring of lending practices over different years and loan types.
