import mongoose from 'mongoose';

// type Category = "database" | "network" | "os" | "algorithm" | "dataStructure";

class Category extends mongoose.SchemaType {
  constructor(key: string, options: object) {
    super(key, options, 'Category');
  }

  cast(val: any) {
    if (
      !['database', 'network', 'os', 'algorithm', 'data-structure', 'design-pattern'].includes(val)
    ) {
      throw new Error('Category: ' + val + ' is not a valid category.');
    }
    return val;
  }
}

mongoose.Schema.Types.Category = Category;