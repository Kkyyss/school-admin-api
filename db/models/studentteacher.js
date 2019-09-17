
module.exports = (sequelize, DataTypes) => {
  const StudentTeacher = sequelize.define('StudentTeachers', {
    teacherId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
  }, {});
  StudentTeacher.associate = function(models) {
    // associations can be defined here
    StudentTeacher.belongsTo(models.Users, {
      as: 'teachers',
      foreignKey: 'teacherId',
      targetKey: 'id',
    });
    StudentTeacher.belongsTo(models.Users, {
      as: 'students',
      foreignKey: 'studentId',
      targetKey: 'id',
    });
  };
  return StudentTeacher;
};
