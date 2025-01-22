package helpers

import (
	"fmt"
	"regexp"
	"strings"
)

func parseStatement(text string) {
	// Patterns for header fields
	customerIDPattern := regexp.MustCompile(`CUSTOMER ID (\d+)`)
	accountNoPattern := regexp.MustCompile(`ACCOUNT NO (\d+)`)
	statementPeriodPattern := regexp.MustCompile(`STATEMENT PERIOD : ([\d\w-]+ to [\d\w-]+)`)

	// Extract header fields
	customerID := extractField(text, customerIDPattern)
	accountNo := extractField(text, accountNoPattern)
	statementPeriod := extractField(text, statementPeriodPattern)

	fmt.Printf("Customer ID: %s\n", customerID)
	fmt.Printf("Account No: %s\n", accountNo)
	fmt.Printf("Statement Period: %s\n", statementPeriod)

	// Parse transactions
	parseTransactions(text)
}

func extractField(text string, pattern *regexp.Regexp) string {
	matches := pattern.FindStringSubmatch(text)
	if len(matches) > 1 {
		return matches[1]
	}
	return ""
}

func parseTransactions(text string) {
	// Pattern for transactions (date | description | debit/credit | balance)
	transactionPattern := regexp.MustCompile(`(\d{2}-[A-Za-z]{3}-\d{4}) \| ([^|]+) \| ([\d,]+\.\d{2}) \| ([\d,]+\.\d{2})`)

	lines := strings.Split(text, "\n")
	for _, line := range lines {
		matches := transactionPattern.FindStringSubmatch(line)
		if len(matches) > 4 {
			date := matches[1]
			description := strings.TrimSpace(matches[2])
			amount := matches[3]
			balance := matches[4]

			fmt.Printf("Date: %s, Description: %s, Amount: %s, Balance: %s\n", date, description, amount, balance)
		}
	}
}
