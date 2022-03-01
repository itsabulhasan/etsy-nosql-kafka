module.exports = (DataTypes) => {
    return {
      // Model attributes are defined here
      shop_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      shop_name: {
        type: DataTypes.STRING(60),
        // allowNull defaults to true
        allowNull: false,
      },
      shop_pic: {
        type: DataTypes.STRING(45),
        // allowNull defaults to true
        allowNull: false,
      },
      user_id:{
          type:DataTypes.INTEGER
      }
    };
  };
  