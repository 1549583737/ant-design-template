<template>
    <div class="list">
      <router-link tag="div" to="/tableList"></router-link>
        <!--tablelist-->
        <a-row>
          <a-col>
            <a-input-search
              placeholder="请输入名称"
              style="width: 200px"
              @search="onSearch"
            />
            <br /><br />
          </a-col>
        </a-row>

        <a-row class="buttonGroup">
          <a-col :span="12">
            <a-button type="primary"@click="handleAdd">添加</a-button>
          </a-col>
          <a-col :span="12" :pull="10">
            <a-button type="danger" @click="deleteSelected">删除</a-button>
          </a-col>
        </a-row>




      <a-table :rowSelection="rowSelection"  :columns="columns" :dataSource="dataSource">


        <a slot="name" slot-scope="text" href="javascript:;">{{text}}</a>
        <span slot="permission1" slot-scope="text, record">
          <a-switch v-model="record.enable" :disabled="true"  @change="onChange" :key="record.key"></a-switch>
        </span>
        <template slot="operation2" slot-scope="text, record">
          <a-button type="primary" @click="editModal(record)" :key="record.key">编辑</a-button>

            <a-popconfirm
              v-if="dataSource.length"
              title="确定删除?"
              okText="确定" cancelText="取消"
              @confirm="() => deleteRow(record)">
              <a-button type="danger">删除</a-button>
            </a-popconfirm>
        </template>
      </a-table>



<!--修改信息模态框     start-->
      <div>
        <a-modal
        title="更改用户信息"
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
                   {rules: [{required: true, message: 'please input your ID!'}]}
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
            label="名称"
            :label-col="{span: 5}"
            :wrapper-col="{span: 12}"
            style="display: none"
          >
            <a-input
              v-decorator="[
                '_id',
                 {rules: [{required: true, message: 'please input your _id!'}]}
                ]"
            ></a-input>
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
              确认修改
            </a-button>
          </a-form-item>

        </a-form>
        </a-modal>


        <add-modal ref="addModal" @triAdd="addUser"></add-modal>

      </div>


      <router-view />
    </div>
</template>

<script>
  import request from '../../utils/request'
  import addModal from './addModal'

  const columns = [{
      key: 'id',
      title: 'ID',
      dataIndex: 'id',
      scopedSlots: { customRender: 'id' },
    },{
    key: 'name',
    title: '名称',
    dataIndex: 'name',
    scopedSlots: { customRender: 'name' },
  }, {
    key: 'role',
    title: '角色',
    dataIndex: 'role',
    slots: 'role',
  }, {
    key: 'enable',
    title: '权限',
    dataIndex: 'enable',
    className: 'enable',
    scopedSlots: { customRender: 'permission1' },
  }, {
    key: 'operation',
    title: '操作',
    dataIndex: 'operation',
    className: 'operation',
    scopedSlots: { customRender: 'operation2' },
  }];

  export default {
    components: {
      addModal
    },
    data() {
      return {
        dataSource:[],
        columns,
        count: 4,
        selectedRowKeys: [],
        selectedRows:[],
        visible: false,
        formLayout: 'horizontal',
        form: this.$form.createForm(this),
      }
    },
    computed: {
      rowSelection() {
        const { selectedRowKeys, selectedRows} = this;
        return {
          onChange: (selectedRowKeys, selectedRows) => {
            this.selectedRowKeys = selectedRowKeys;
            this.selectedRows = selectedRows;
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
          },
          getCheckboxProps: record => ({
            props: {
              disabled: record.name === 'Disabled User', // Column configuration not to be checked
              name: record.name,
            }
          }),
        }
      }
    },
    beforeCreate() {
      this.form = this.$form.createForm(this);
    },
    created() {
      this.$nextTick(()=>{
          this.getUserInfo();
          // this.addUser();
      })
    },
    methods: {
      onSearch(values) {
        this.getUserInfo(values);
      },
      /**
      * a-switch
      */
      onChange(checked) {
        // alert(`a-switch to ${checked}`);
      },
      editModal(record) {
        this.visible = true;
        this.$nextTick(function (){
          this.handleSelectChange(record);
        });
      },
      handleOk() {
        this.visible = false;
      },

      /**
      * 点击确认修改
      */
      handleSubmit (e) {
        e.preventDefault();
        this.form.validateFields((err, values) => {
          if (!err) {
            console.log('Received values of form: ', values);
            this.modifyUser({_id: values._id, id: values.id, name: values.name, role: values.role, enable: values.enable})
          }
        });
      },
      /**
      * 点击编辑按钮后赋初始值
      */
      handleSelectChange (record) {
        this.form.setFieldsValue({
          _id: record._id,
          id: record.id,
          name: record.name,
          role: record.role,
          enable: record.enable.toString(),
        })
      },

      /**
      * 手动添加用户
      */
      handleAdd() {
        // const { count, data } = this;
        // const newData = {
        //   key: count,
        //   id: count+1,
        //   name: `new ${count+1}`,
        //   role: 2,
        //   permission: 'New York No. 1 Lake Park',
        //   operation: '修改'
        // };
        // this.dataSource = [...data, newData];
        // this.count = count + 1;
        this.$refs.addModal.openAddModal();
      },
      deleteRow(record) {
        // this.dataSource = this.dataSource.filter((item)=> item.key!== record.key);
        this.deleteUser([record._id]);
        // this.$message.success(`${record.name}的记录删除成功`);
      },
      deleteSelected(){
        if(!this.selectedRowKeys.length) {
          this.$message.info('您还未勾选删除项');
        }else{
          let ids = [];
          for(let item of this.selectedRows) {
            ids.push(item._id);
            // this.deleteRow(i);
          }
          this.deleteUser(Array.from(new Set(ids)));
        }
      },
      onSelectChange (selectedRowKeys) {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
      },
      onCellChange (key, dataIndex, value) {
        const dataSource = [...this.dataSource];
        const target = dataSource.find(item => item.key === key);
        if (target) {
          target[dataIndex] = value;
          this.dataSource = dataSource
        }
      },
      /**
       * 查询用户信息
       */
       getUserInfo(name) {
        let params;
        if(!name&&name!=0){
          params = '';
        }else {
          params = `/${name}`;
        }
        request.get(this.HOST+'/users' + params).then((response)=> {
          let res = response;
          let temp = [];
          for(let i in res) {
            temp.push({
              key: res[i]._id,
              _id: res[i]._id,
              enable: res[i].enable,
              id: res[i].id,
              name: res[i].name,
              role: res[i].role,
            })
          }
          this.dataSource = temp;
          // console.log(this.dataSource);
        }).catch(function (error){
          console.log(error);

        })
       },
      /**
       * 添加用户
       */
        addUser(userInfo) {
          request.put(this.HOST+'/user', {id: userInfo.id, name: userInfo.name,role: userInfo.role , enable: userInfo.enable}).then((response)=> {
              if(response=='success') {
                this.$message.success(`添加${userInfo.name}成功`);
                this.getUserInfo();
              }else if(response=='fail'){
                this.$message.info(`网络繁忙请重试`);
              }
          }).catch((err)=>{
            console.log(err);
          })
        },
      /**
       * 删除用户包括批量删除
       */
       deleteUser(ids) {
        request.delete(this.HOST+'/user', {data: {_id: ids}}).then((response)=> {
          if(response.ok === 1) {
            this.$message.success('删除成功');
            this.selectedRowKeys = [];
            this.selectedRows = [],
            this.getUserInfo();
          }
        }).catch((err)=> {
          this.$message.error(err);
        })
       },
      /**
       * 修改用户信息
       */
       modifyUser({_id, id, name, role, enable}) {
        let params = new URLSearchParams();
        params.append('_id', _id);
        params.append('id', id);
        params.append('name', name);
        params.append('role', role);
        params.append('enable', enable=='true'? true : false);
        request.post(this.HOST+'/user', params).then((response)=> {
          this.$message.success('编辑成功');
          this.visible = false;
          this.getUserInfo();
        }).catch((err)=> {
          console.log(err);
        })
       }

    }
  }


</script>

<style scoped>
  .list {
    background-color: #ffffff;
    padding: 30px;
  }
  .buttonGroup {
    margin-bottom: 20px;
  }
  .operation>button:nth-child(1) {
    margin-right: 10px;
  }
</style>
