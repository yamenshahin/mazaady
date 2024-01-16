export const useFormDataStore = defineStore('formData', {
  state: () => ({
    formData: [] as any,
    categoriesMain: [] as any,
    categoriesChildren: [] as any,
    properties: [] as any,
  }),
  actions: {
    /* restFormData() {
      this.formData = [];
    }, */
    restCategoriesMain() {
      this.categoriesMain = [];
    },
    restCategoriesChild() {
      this.categoriesChildren = [];
    },
    removeCurrentChildCategory() {
      this.formData.length = 1;
    },
    restProperties() {
      this.properties = [];
    },
    setCategoriesMain(data: any) {
      this.categoriesMain = data;
    },
    setCategoriesChildren(data: any) {
      this.categoriesChildren = data;
    },
    setProperties(data: any) {
      this.properties = data;
    },
    setCurrentMainCategory(id: number, name: string) {
      this.formData[0] = { 'main category id': id, 'main category name': name };
    },
    setCurrentChildCategory(id: number, name: string) {
      this.formData[1] = { 'child category id': id, 'child category name': name };
    },
    isPropertyEmpty() {
      return this.formData.length < 3;
    },
    addProperty(propertyID: number, optionID: number, optionValue: string) {
      if (this.isPropertyEmpty()) {
        this.formData[2] = [{ 'property id': propertyID, 'option id': optionID, 'option value': optionValue }];
      } else {
        //Look for the propertyID
        for (const property of this.formData[2]) {
          if (property['property id'] === propertyID) {
            [property['option id'], property['option value']] = [optionID, optionValue];
            return;
          }
        }
        //If cant find propertyID -> add it
        this.formData[2].push({ 'property id': propertyID, 'option id': optionID, 'option value': optionValue });
      }
    },
    removeProperty(propertyID: number) {
      //Look for the propertyID
      for (const [index, property] of this.formData[2].entries()) {
        if (property['property id'] === propertyID) {
          this.formData[2].splice(index, 1);

          //Totally clear property
          if (this.formData[2].length === 0) {
            this.formData.length = 2;
          }
          return;
        }
      }
    },
    setOptionSub(parentList: any, optionID: number, optionValue: string) {
      const newParentList = toRaw(parentList);
      for (const obj of this.formData) {
        
        this.updateSpecificOptionSub(obj, newParentList, optionID, optionValue);
      }

    },
    updateSpecificOptionSub(obj: any, parentList: any, optionID: number, optionValue: string) {
      if (Array.isArray(obj)) {
        for (const subObj of obj) {
          if (subObj['option id'] == parentList[0]) {
            if (!subObj['sub options']) {
              subObj['sub options'] = [{ 'option id': optionID, 'option value': optionValue }];
              return;
            } else {
              let newParentList = [...parentList];
              
              newParentList.shift();
              this.updateSpecificOptionSub(subObj['sub options'], newParentList, optionID, optionValue);
              return;
            }

          } else {
            this.updateSpecificOptionSub(subObj, parentList, optionID, optionValue);
          }
        }
      }
    },
    removeOptionSub(parentList: any){
      const newParentList = toRaw(parentList);
      this.removeSpecificOptionSub(this.formData[2], newParentList);

    },
    removeSpecificOptionSub(obj: any, parentList: any) {
      
      if (Array.isArray(obj)) {
        for(const newObj of obj) {
          if((newObj['sub options'][0]['sub options'])) {
            this.removeSpecificOptionSub(newObj['sub options'], parentList)
          } else{
           delete newObj['sub options'];
          }
        } 
      } 
      
    },
  }
});