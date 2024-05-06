<script setup lang="ts">
import { computed, PropType } from "vue";
import XButton from "./XButton.vue";

type CheckboxValue = string | boolean | number;
type CheckboxValues = CheckboxValue[];

type CheckboxOption = {
  label: string;
  value: CheckboxValue;
};
type CheckboxOptions = CheckboxOption[];

const props = defineProps({
  value: {
    type: [String, Number, Boolean, Array] as PropType<
      CheckboxValue | CheckboxValues
    >,
    default: undefined,
  },
  options: {
    type: Array as PropType<CheckboxOptions>,
    default: () => [],
  },
  disabled: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  multiple: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
});

const emits = defineEmits(["update:value"]);

const computedValue = computed({
  get: () => props.value,
  set: (value: CheckboxValue | CheckboxValues) => {
    emits("update:value", value);
  },
});

const computedButtonType = (op: CheckboxOption) => {
  if (props.multiple) {
    return (computedValue.value as CheckboxValues).includes(op.value)
      ? "primary"
      : "default";
  }
  return computedValue.value === op.value ? "primary" : "default";
};

const changeCheckedValue = (op: CheckboxOption) => {
  if (!props.multiple) {
    computedValue.value = op.value;
    return;
  }
  if (!computedValue.value || !(computedValue.value as CheckboxValues).length) {
    computedValue.value = [op.value];
    return;
  }
  if ((computedValue.value as CheckboxValues).includes(op.value)) {
    computedValue.value = (computedValue.value as CheckboxValues).filter(
      (i) => i !== op.value,
    );
  } else {
    (computedValue.value as CheckboxValues).push(op.value);
  }
};
</script>

<template>
  <div class="x-checkbox-button-group">
    <x-button
      v-for="(op, idx) in options"
      :key="idx"
      :disabled="disabled"
      :type="computedButtonType(op)"
      @click="changeCheckedValue(op)"
    >
      {{ op.label }}
    </x-button>
  </div>
</template>

<style lang="scss">
.x-checkbox-button-group {
  display: flex;
  flex-wrap: nowrap;
  > .x-button.x-button-default,
  > .x-button.x-button-primary {
    border-radius: 0;
    &:first-child {
      border-radius: 2px 0 0 2px;
    }
    &:last-child {
      border-radius: 0 2px 2px 0;
    }
  }
}
</style>
