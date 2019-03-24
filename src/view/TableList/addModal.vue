<template>
    <div class="addModal">
        <a-modal
          title="添加用户信息"
          v-model="visible"
          @ok="handleOk"
          :footer="null"
        >

          <a-form
            :form="form"
            @submit="handleSubmit"
          >
            <a-form-item
              label="ID"
              :label-col="{span: 5}"
              :wrapper-col="{span: 5}"
            >
              <!--{getFieldDecorator('id', {-->
              <!--initialValue:'',-->
              <!--rules: [{ required: true, message: '请选择订单状态' }],-->
              <!--})(-->
              <a-input
                v-decorator="[
                  'id',
                   {rules: [{
                      required: true,
                      message: '必须为数字!',
                      pattern:new RegExp('^\\d+$','g'),
                    }]}
                ]"
                placeholder="请输入ID"
              />
              <!--)}-->


            </a-form-item>

            <a-form-item
              label="名称"
              :label-col="{span: 5}"
              :wrapper-col="{span: 12}"
            >
              <a-input
                v-decorator="[
              'name',
               {rules: [{required: true, message: 'please input your name!'}]}
              ]"
                placeholder="请输入名称"
              />
            </a-form-item>


            <a-form-item
              label="角色"
              :label-col="{span: 5}"
              :wrapper-col="{span: 12}"
            >
              <a-select
                v-decorator="[
              'role',
              {rules: [{ required: true, message: 'Please select your role!' }]}
            ]"
                placeholder="请选择角色"
              >
                <a-select-option value="1">
                  角色1
                </a-select-option>
                <a-select-option value="2">
                  角色2
                </a-select-option>

              </a-select>
            </a-form-item>

            <a-form-item
              label="权限"
              :label-col="{span: 5}"
              :wrapper-col="{span: 12}"
            >
              <a-select
                v-decorator="[
              'enable',
              {rules: [{ required: true, message: 'Please select your permission!' }]}
            ]"
                placeholder="请选择权限"
              >
                <a-select-option value="true">
                  true
                </a-select-option>
                <a-select-option value="false">
                  false
                </a-select-option>

              </a-select>
            </a-form-item>


            <a-form-item
              :wrapper-col="{ span: 12, offset: 5 }"
            >
              <a-button
                type="primary"
                html-type="submit"
              >
                确认添加
              </a-button>
            </a-form-item>
          </a-form>
        </a-modal>
    </div>
</template>

<script>
    export default {
        name: "addModal",
        data() {
          return {
            visible: false,
            form: this.$form.createForm(this),
          }
        },
        methods: {
          openAddModal() {
            this.visible = true;

          },
          handleOk() {
            this.visible = false;
          },
          handleSubmit(e) {
            e.preventDefault();
            this.form.validateFields((err, values) => {
              if (!err) {
                console.log('Received values of form: ', values);
                this.visible = false;
                this.$emit('triAdd', values);
                // this.modifyUser({_id: values._id, id: values.id, name: values.name, role: values.role, enable: values.enable})
              }
            });
          }
        }
    }
</script>

<style scoped>

</style>
