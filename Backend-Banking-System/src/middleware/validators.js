const { z } = require("zod");

/**
 * Validates that a string is a valid MongoDB ObjectId (24-char hex)
 */
const objectIdSchema = z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Must be a valid ObjectId");

/**
 * Schema: POST /api/transactions/
 */
const createTransactionSchema = z
    .object({
        fromAccount: objectIdSchema,
        toAccount: objectIdSchema,
        amount: z
            .number({ invalid_type_error: "Amount must be a number" })
            .positive("Amount must be greater than 0"),
        idempotencyKey: z
            .string()
            .min(1, "idempotencyKey is required")
            .max(256, "idempotencyKey is too long"),
    })
    .strict()
    .refine((data) => data.fromAccount !== data.toAccount, {
        message: "fromAccount and toAccount must be different",
        path: ["toAccount"],
    });

/**
 * Schema: POST /api/transactions/system/initial-funds
 */
const createInitialFundsSchema = z
    .object({
        toAccount: objectIdSchema,
        amount: z
            .number({ invalid_type_error: "Amount must be a number" })
            .positive("Amount must be greater than 0"),
        idempotencyKey: z
            .string()
            .min(1, "idempotencyKey is required")
            .max(256, "idempotencyKey is too long"),
    })
    .strict();

/**
 * Middleware factory — returns express middleware that validates req.body
 * against the provided Zod schema.
 */
function validate(schema) {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            const errors = result.error.issues.map((issue) => ({
                field: issue.path.join("."),
                message: issue.message,
            }));

            return res.status(400).json({
                message: "Validation failed",
                errors,
            });
        }

        req.body = result.data; // use parsed/coerced data
        return next();
    };
}

module.exports = {
    validate,
    createTransactionSchema,
    createInitialFundsSchema,
};
