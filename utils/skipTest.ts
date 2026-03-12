import { test } from "@fixtures/indexV2";

export function markStepAsSkipped(
    step: string,
    reason: string = "Required desktop resolution",
) {
    test.info().annotations.push({
        type: "skip",
        description: `${step}. The reason: ‹${reason}›`,
    });
}
