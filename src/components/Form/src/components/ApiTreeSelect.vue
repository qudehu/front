<template>
  <a-tree-select v-bind="getAttrs" @change="handleChange">
    <template #[item]="data" v-for="item in Object.keys($slots)">
      <slot :name="item" v-bind="data || {}"></slot>
    </template>
    <template #suffixIcon v-if="loading">
      <LoadingOutlined spin />
    </template>
  </a-tree-select>
</template>

<script lang="ts">
  import { computed, defineComponent, watch, ref, onMounted, unref } from 'vue';
  import { TreeSelect } from 'ant-design-vue';
  import { isArray, isFunction } from '/@/utils/is';
  import { get } from 'lodash-es';
  import { propTypes } from '/@/utils/propTypes';
  import { LoadingOutlined } from '@ant-design/icons-vue';
  import { defHttp } from '/@/utils/http/axios';

  export default defineComponent({
    name: 'ApiTreeSelect',
    components: { ATreeSelect: TreeSelect, LoadingOutlined },
    props: {
      api: {
        type: [Function, String] as PropType<(arg?: Recordable) => Promise<Recordable> | String>,
      },
      params: { type: Object },
      immediate: { type: Boolean, default: true },
      resultField: propTypes.string.def(''),
    },
    emits: ['options-change', 'change'],
    setup(props, { attrs, emit }) {
      const treeData = ref<Recordable[]>([]);
      const isFirstLoaded = ref<Boolean>(false);
      const loading = ref(false);
      const getAttrs = computed(() => {
        return {
          ...(props.api ? { treeData: unref(treeData) } : {}),
          ...attrs,
        };
      });

      function handleChange(...args) {
        emit('change', ...args);
      }

      watch(
        () => props.params,
        () => {
          !unref(isFirstLoaded) && fetch();
        },
        { deep: true },
      );

      watch(
        () => props.immediate,
        (v) => {
          v && !isFirstLoaded.value && fetch();
        },
      );

      onMounted(() => {
        props.immediate && fetch();
      });

      async function fetch() {
        let api: any;
        if (typeof props.api === 'string' && props.api) {
          api = (params) => {
            return defHttp.post({ url: props.api as any, params });
          };
        } else {
          api = props.api;
        }
        if (!api || !isFunction(api)) return;
        loading.value = true;
        treeData.value = [];
        let result;
        try {
          result = await api(props.params);
        } catch (e) {
          console.error(e);
        }
        loading.value = false;
        if (!result) return;
        if (!isArray(result)) {
          result = get(result, props.resultField);
        }
        treeData.value = (result as Recordable[]) || [];
        isFirstLoaded.value = true;
        emit('options-change', treeData.value);
      }
      return { getAttrs, loading, handleChange };
    },
  });
</script>
