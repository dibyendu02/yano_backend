const { default: mongoose } = require("mongoose");
const UserPatient = require("../models/UserPatient");

const maleUserRelationship = {
  father: "son",
  mother: "son",
  son: "father",
  daughter: "father",
  sibling: "sibling",
  wife: "husband",
  grandparent: "grandchild",
  grandchild: "grandparent",
  other: "other",
};

const femaleUserRelationship = {
  father: "daughter",
  mother: "daughter",
  son: "mother",
  daughter: "mother",
  sibling: "sibling",
  husband: "wife",
  grandparent: "grandchild",
  grandchild: "grandparent",
  other: "other",
};

exports.addFamilyMember = async (req, res) => {
  try {
    const user = req.user;
    const { userId, relation } = req.body;

    const userDetail = await UserPatient.findById(user.id);

    if (!userDetail) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    if (
      userDetail.familyLink.some(
        (member) => member.userId.toString() === userId.toString()
      )
    ) {
      return res.status(400).json({
        message: "Family member already exists",
      });
    }

    const patient = await UserPatient.findById(userId);

    if (!patient) {
      return res.status(400).json({
        message: "Member not found",
      });
    }

    const familyMember = {
      relation: relation.toLowerCase(),
      userId: patient._id,
    };

    userDetail.familyLink.push(familyMember);

    let patientFamilyMember;

    if (userDetail.gender == "Male") {
      patientFamilyMember = {
        relation: maleUserRelationship[relation],
        userId: userDetail._id,
      };
    } else {
      patientFamilyMember = {
        relation: femaleUserRelationship[relation],
        userId: userDetail._id,
      };
    }

    patient.familyLink.push(patientFamilyMember);

    await userDetail.save();
    await patient.save();

    return res.status(200).json({
      message: "Family member added successfully",
      familyLink: userDetail.familyLink,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An error occurred while adding the family member",
      error: error.message,
    });
  }
};

exports.getFamilyMembers = async (req, res) => {
  try {
    const user = req.user;

    const userFamilyLink = await UserPatient.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(user.id),
        },
      },
      {
        $unwind: "$familyLink",
      },
      {
        $lookup: {
          from: "userpatients",
          localField: "familyLink.userId",
          foreignField: "_id",
          as: "familyMemberDetails",
        },
      },
      {
        $unwind: "$familyMemberDetails",
      },
      {
        $project: {
          "familyLink.userId": "$familyMemberDetails._id",
          "familyLink.firstName": "$familyMemberDetails.firstName",
          "familyLink.lastName": "$familyMemberDetails.lastName",
          "familyLink.email": "$familyMemberDetails.email",
          "familyLink.dateOfBirth": "$familyMemberDetails.dateOfBirth",
          "familyLink.userImg": "$familyMemberDetails.userImg",
          "familyLink.country": "$familyMemberDetails.country",
          "familyLink.height": "$familyMemberDetails.height",
          "familyLink.weight": "$familyMemberDetails.weight",
          "familyLink.bloodType": "$familyMemberDetails.bloodType",
          "familyLink.relation": "$familyLink.relation",
        },
      },
    ]);

    return res.status(200).json({
      message: "Family members fetched successfully",
      familyMembers: userFamilyLink.map((doc) => doc.familyLink),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An error occurred while fetching family members",
      error: error.message,
    });
  }
};

exports.getFamilyMemberById = async (req, res) => {
  try {
    const user = req.user;
    const { userId } = req.params;

    const userFamilyLink = await UserPatient.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(user.id),
        },
      },
      {
        $unwind: "$familyLink",
      },
      {
        $match: {
          "familyLink.userId": new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "userpatients",
          localField: "familyLink.userId",
          foreignField: "_id",
          as: "familyDetails",
        },
      },
      {
        $unwind: "$familyDetails",
      },
      {
        $project: {
          _id: 0,
          "familyDetails.userId": "$familyDetails._id",
          "familyDetails.firstName": 1,
          "familyDetails.lastName": 1,
          "familyDetails.email": 1,
          "familyDetails.dateOfBirth": 1,
          "familyDetails.userImg": 1,
          "familyDetails.country": 1,
          "familyDetails.height": 1,
          "familyDetails.weight": 1,
          "familyDetails.bloodType": 1,
          "familyDetails.relation": "$familyLink.relation",
        },
      },
    ]);

    if (!userFamilyLink.length) {
      return res.status(404).json({
        message: "Family member not found",
      });
    }

    return res.status(200).json({
      message: "Family member fetched successfully",
      familyMember: userFamilyLink[0].familyDetails,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An error occurred while fetching the family member",
      error: error.message,
    });
  }
};

exports.updateFamilyMember = async (req, res) => {
  try {
    const user = req.user;
    const { userId } = req.params;
    const { relation } = req.body;

    const userDetail = await UserPatient.findById(user.id);

    if (!userDetail) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const patient = await UserPatient.findById(userId);

    if (!patient) {
      return res.status(400).json({
        message: "Member not found",
      });
    }

    userDetail.familyLink.forEach((member) => {
      if (member.userId.toString() === userId) {
        member.relation = relation;
      }
    });

    patient.familyLink.forEach((member) => {
      if (member.userId.toString() === user.id) {
        if (userDetail.gender == "Male") {
          member.relation = maleUserRelationship[relation];
        } else {
          member.relation = femaleUserRelationship[relation];
        }
      }
    });

    userDetail.markModified("familyLink");
    await userDetail.save();

    patient.markModified("familyLink");
    await patient.save();

    return res.status(200).json({
      message: "Family member updated successfully",
      familyLink: userDetail.familyLink,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An error occurred while updating the family member",
      error: error.message,
    });
  }
};

exports.deleteFamilyMember = async (req, res) => {
  try {
    const user = req.user;
    const { userId } = req.params;

    const userDetail = await UserPatient.findById(user.id);

    if (!userDetail) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const patient = await UserPatient.findById(userId);

    if (!patient) {
      return res.status(400).json({
        message: "Member not found",
      });
    }

    userDetail.familyLink = userDetail.familyLink.filter(
      (member) => member.userId.toString() !== userId
    );

    patient.familyLink = patient.familyLink.filter(
      (member) => member.userId.toString() !== user.id
    );

    await userDetail.save();
    await patient.save();

    return res.status(200).json({
      message: "Family member deleted successfully",
      familyLink: userDetail.familyLink,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An error occurred while deleting the family member",
      error: error.message,
    });
  }
};
